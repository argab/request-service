import {RequestService, Request} from "./Request"

class RequestDispatcher {

    _request
    _service
    _factory

    constructor({request, service}) {

        if (false === (request instanceof Request))
            throw 'The RequestDispatchers`s "request" is not an instance of "Request".'

        if (false === (service instanceof RequestService))
            throw 'The RequestDispatchers`s "service" is not an instance of "RequestService".'

        this._request = request
        this._service = service
        this._factory = service._factory
    }

    push() {
        this._request.data.log && this._service.log(this._request)
    }

    fetchData () {
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
        const promise = dataClient instanceof Promise
            ? dataClient
            : new Promise(res => setTimeout(() => res(dataClient), 100))

        getLoader()?.start()

        promise.then(async response => {

            await this.onResponse(response, handlers)
            data.statusCode || (data.statusCode = 200)

        }).catch(async error => {

            await this.onCatch(error, handlers)
            data.statusCode || (data.statusCode = 500)

        }).finally(async () => {

            getLoader()?.end()
            await this.onFinally(handlers)
            data.statusCode || (data.statusCode = 200)

            if (data.retryOnCatch || data.retry) await this.retry()
        })
    }

    fetch() {
        const request = this._request
        const fetch = this.awaitResult()

        request._methods.forEach(method => request[method] instanceof Function && (fetch[method] = (arg) => {
            request.chain.push({method, args: [arg]})
            request[method](arg)
            return fetch
        }))

        return fetch
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

    async onResponse(response, handlers) {

        const request = this._request
        this.resolveHandlers(response, handlers, 'after')

        const _response = {...response}
        const isSuccess = this.resolveHandlers(_response, handlers, 'isSuccess')
        const isError = this.resolveHandlers(_response, handlers, 'isError')

        if (isSuccess === true || (isSuccess !== true && isError !== true)) {

            await this.setResult(request.data.success instanceof Function
                ? request.data.success(response)
                : this.resolveHandlers(response, handlers, 'onSuccess'))

        } else if (isError === true) {

            await this.setResult(request.data.error instanceof Function
                ? request.data.error(response)
                : this.resolveHandlers(response, handlers, 'onError'))
        }
    }

    async onCatch(error, handlers) {

        const request = this._request
        this.resolveHandlers(error, handlers, 'afterCatch')

        if (request.data.catch instanceof Function) {
            try {
                request.data.dataError = error
                await this.setResult(request.data.catch(error))
            } catch (err) {
                request.data.dataError = err
                await this.setResult(this.resolveHandlers(err, handlers, 'onCatch'))
            }
        } else {
            request.data.dataError = error
            await this.setResult(this.resolveHandlers(error, handlers, 'onCatch'))
        }
    }

    async onFinally(handlers) {

        const request = this._request
        this.resolveHandlers(request.data, handlers, 'afterFinally')

        let result = null

        if (request.data.finally instanceof Function) {
            try {
                result = request.data.finally(request.data)
            } catch (err) {
                result = this.resolveHandlers(err, handlers, 'onCatch')
            }
        } else {
            result = this.resolveHandlers(request.data, handlers, 'onFinally')
        }

        request.data.result === null && await this.setResult(result)
    }

    awaitResult(withRetryCheck = true) {
        const request = this._request
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (withRetryCheck && (request.data.retry || request.data.retryOnCatch)) {
                    return
                }
                if (request.data.statusCode) {
                    clearInterval(interval)
                    setTimeout(() => resolve(request.data.result), 10)
                }
            }, 1)
        })
    }

    async setResult(result) {
        result === undefined && (result = null)
        this._request.data.result = result instanceof Promise ? await result : result
    }

    async retry(resolve) {
        await this.awaitResult(false)
        new this._service._retry({
            request: this._request,
            service: this._service,
            resolve
        }).retry()
    }

}

export {RequestDispatcher}
