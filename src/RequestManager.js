import {RequestService, Request} from "./Request"
import {REQUEST_RESOLVE_METHODS} from "./Request"

class RequestManager {

    _request
    _service
    _factory

    _resolve = []
    _retry

    constructor({request, service}) {

        if (false === (request instanceof Request))
            throw 'The RequestManager`s "request" is not an instance of "Request".'

        if (false === (service instanceof RequestService))
            throw 'The RequestManager`s "service" is not an instance of "RequestService".'

        this._request = request
        this._service = service
        this._factory = service._factory
    }

    save() {
        this._request.data.log && this._service.log(this._request)
    }

    fetchData() {

        const data = this._request.data
        const handlers = this._factory.getHandlers(data, handler => {
            handler.prototype.retry = (resolve) => this.retry(resolve)
        })

        this.resolveHandlers(data, handlers, 'before')

        const client = this._factory.getClient(data)
        const loader = this._factory.getLoader(data)
        const dataClient = data.stubData || client[data.method](data)
        const getLoader = () => {
            loader && (loader.pending = this._service?.getLog().filter(r => r.data.useLoader && !r.data.statusCode).length)
            return loader
        }

        return {data, client, handlers, loader, dataClient, getLoader}
    }

    send() {

        const {data, handlers, dataClient, getLoader} = this.fetchData()
        const promise = dataClient instanceof Promise ? dataClient : new Promise(res => setTimeout(() => res(dataClient), 100))

        getLoader()?.start()

        promise.then(async response => {

            await this.setResult(response)
            await this.onResponse(response, handlers)
            data.statusCode || this.setStatusCode(response, 200)

        }).catch(async error => {

            this.setError(error)
            await this.handleError(error, handlers)
            data.statusCode || this.setStatusCode(error, 500)

        }).finally(async () => {

            getLoader()?.end()

            await this.onFinally(handlers)
            data.statusCode || this.setStatusCode(null, 200)

            const retry = this._retry instanceof Function ? this._retry() : this.retry()
            retry === false && this._request._resolve()
        })
    }

    fetch() {
        const request = this._request
        if (request._fetch instanceof Promise) return request._fetch

        request._fetch = new Promise(resolve => request._resolve = () => resolve(request.data.result))
        request._methods.forEach(method => request[method] instanceof Function && (request._fetch[method] = (arg) => {

            if (REQUEST_RESOLVE_METHODS.includes(method)) {
                arg instanceof Function || (arg = () => undefined)
            } else request[method](arg)

            this._resolve.push({method, arg})
            request.chain.push({method, args: [arg]})

            return request._fetch
        }))

        return request._fetch
    }

    resolveHandlers(data, handlers, action) {
        let result = undefined
        handlers.forEach(handler => {
            if (handler[action] instanceof Function) {
                const _data = handler[action](data)
                _data === undefined || (result = _data)
            }
        })
        return result
    }

    resolveRequest(methods, data, handlers) {

        return new Promise(async resolve => {

            const source = this._resolve.filter(r => methods.includes(r.method))

            if (source.length === 0) return resolve(false)

            const fetch = async (data) => {
                if (source.length === 0) return resolve(true)
                try {
                    source[0].arg instanceof Function && await this.setResult(source[0].arg(data))
                } catch (err) {
                    await this.handleError(err, handlers)
                }
                source.shift()
                await fetch(this._request.data.result)
            }

            await fetch(data)
        })
    }

    handleError(error, handlers) {

        this.resolveHandlers(error, handlers, 'afterCatch')

        return new Promise(async resolve => {

            const onCatch = this._resolve.filter(r => r.method === 'catch')

            if (onCatch.length === 0) {
                this.setError(error)
                await this.setResult(this.resolveHandlers(error, handlers, 'onCatch'))
                return resolve()
            }

            const fetch = async (error) => {
                if (onCatch.length === 0) return resolve()
                try {
                    this.setError(error)
                    onCatch[0].arg instanceof Function && await this.setResult(onCatch[0].arg(error))
                } catch (err) {
                    this.setError(err)
                    await this.setResult(this.resolveHandlers(err, handlers, 'onCatch'))
                    error = err
                }
                onCatch.shift()
                await fetch(error)
            }

            await fetch(error)
        })
    }

    setError(error) {
        this._request.data.dataError = error
    }

    async onResponse(response, handlers) {

        this.resolveHandlers(response, handlers, 'after')

        const _response = {...response}
        const isSuccess = this.resolveHandlers(_response, handlers, 'isSuccess')
        const isError = this.resolveHandlers(_response, handlers, 'isError')

        if (isSuccess === true && this._resolve.map(i => i.method).includes('success')) {

            const resolved = await this.resolveRequest(['success'], response, handlers)
            resolved || await this.setResult(this.resolveHandlers(response, handlers, 'onSuccess'))

        } else if (isError === true && this._resolve.map(i => i.method).includes('error')) {

            const resolved = await this.resolveRequest(['error'], response, handlers)
            resolved || await this.setResult(this.resolveHandlers(response, handlers, 'onError'))

        } else if (isSuccess !== false) {

            await this.resolveRequest(['then'], response, handlers)
        }
    }

    async onFinally(handlers) {
        const request = this._request
        this.resolveHandlers(request.data, handlers, 'afterFinally')
        const resolved = await this.resolveRequest(['finally'], request.data, handlers)
        resolved || await this.setResult(this.resolveHandlers(request.data, handlers, 'onFinally'))
    }

    async setResult(result) {
        result === undefined || (this._request.data.result = result instanceof Promise ? await result : result)
    }

    setStatusCode(source, def) {
        def = Number.isNaN(+def) ? 0 : +def
        this._request.data.statusCode = Number.isNaN(+source?.status) ? def : +source.status
    }

    retry(resolve) {

        const request = this._request
        const retry = () => {
            new this._service._retry({
                request,
                service: this._service,
                resolve
            }).retry()
        }

        if (resolve !== undefined) return this._retry = retry
        if (request.data.retry || request.data.retryOnCatch) return retry()

        return false
    }

}

export {RequestManager}
