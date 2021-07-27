import {ClientDecorator, RequestDecorator} from "./Decorators"
import {RequestHandler, RequestLoader} from "./Interfaces"
import {AbstractRequest} from "./Request"

class RequestFactory {

    _handler
    _client
    _request
    _requestService

    constructor({client, handler, requestDecorator, requestService}) {
        this._handler = RequestHandler.isPrototypeOf(handler) ? handler : RequestHandler
        this._client = ClientDecorator.isPrototypeOf(client) ? client : ClientDecorator
        this._request = RequestDecorator.isPrototypeOf(requestDecorator) ? requestDecorator : RequestDecorator
        AbstractRequest.prototype.isPrototypeOf(Object.getPrototypeOf(requestService)) && (this._requestService = requestService)
    }

    create({method, uri, params, config}) {
        config instanceof Object || (config = {})

        if (this._requestService) {
            const extend = this._requestService._extend.request
            extend instanceof Object && Object.keys(extend).forEach(key => this._request.prototype[key] = extend[key])
        }

        return new this._request({...config, ...{uri, params, method}})
    }

    dispatch(request) {
        if (false === (request instanceof RequestDecorator)) return

        const client = this.getClient(request.data)
        client[request.data.method] instanceof Function && this.resolveClient(client, request)

        return request
    }

    getClient(data) {
        const client = ClientDecorator.isPrototypeOf(data.client) ? data.client : this._client
        return new client(data)
    }

    getHandlers(data) {
        const output = []
        let handlers = data.handler || this._handler
        Array.isArray(handlers) || (handlers = [handlers])

        handlers.forEach(handler => {
            (RequestHandler.isPrototypeOf(handler) || RequestHandler.prototype === handler.prototype) && output.push(new handler(data))
        })

        return output
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

    resolveClient(client, request) {

        const handlers = this.getHandlers(request.data)
        this.resolveHandlers(request.data, handlers, 'before')

        const dataClient = request.data.stubData || client[request.data.method](request.data)
        const promise = dataClient instanceof Promise
            ? dataClient : new Promise(res => setTimeout(() => res(dataClient), 100))
        const Loader = (request.data.useLoader
            && (RequestLoader.isPrototypeOf(request.data.loader) || RequestLoader.prototype === request.data.loader.prototype))
            ? new request.data.loader(request.data) : null
        const getLoader = () => {
            Loader && (Loader.pending = this._requestService?._requests.filter(r => r.data.useLoader && !r.data.statusCode).length)
            return Loader
        }

        getLoader()?.start()

        promise.then(response => {
            this.resolveClientOnResponse(response, request, handlers)
            request.data.statusCode || (request.data.statusCode = 200)
        }).catch(error => {
            this.resolveClientOnCatch(error, request, handlers)
            request.data.statusCode || (request.data.statusCode = 500)
        }).finally(() => {
            this.resolveClientOnFinally(request, handlers)
            request.data.statusCode || (request.data.statusCode = 200)
            getLoader()?.end()
        })

    }

    resolveClientOnResponse(response, request, handlers) {

        this.resolveHandlers(response, handlers, 'after')

        const _response = {...response}
        const isSuccess = this.resolveHandlers(_response, handlers, 'isSuccess')
        const isError = this.resolveHandlers(_response, handlers, 'isError')

        if (isSuccess === true || (isSuccess !== true && isError !== true)) {

            this.setRequestResult(request, request.data.success instanceof Function
                ? request.data.success(response)
                : this.resolveHandlers(response, handlers, 'onSuccess'))

        } else if (isError === true) {

            this.setRequestResult(request, request.data.error instanceof Function
                ? request.data.error(response)
                : this.resolveHandlers(response, handlers, 'onError'))
        }
    }

    resolveClientOnCatch(error, request, handlers) {

        this.resolveHandlers(error, handlers, 'afterCatch')

        if (request.data.catch instanceof Function) {
            try {
                this.setRequestResult(request, request.data.catch(error))
                request.data.dataError = error
            } catch (err) {
                this.setRequestResult(request, this.resolveHandlers(err, handlers, 'onCatch'))
                request.data.dataError = err
            }
        } else {
            this.setRequestResult(request, this.resolveHandlers(error, handlers, 'onCatch'))
        }
    }

    resolveClientOnFinally(request, handlers) {

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

        request.data.result === null && this.setRequestResult(request, result)
    }

    setRequestResult(request, result) {
        request.data.result = result === undefined ? null : result
        return this
    }

}

export {RequestFactory}
