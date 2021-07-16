import {ClientDecorator, RequestDecorator} from "./Decorators"
import {RequestHandler} from "./Interfaces"

class RequestFactory {

    _handler
    _client
    _request

    constructor({client, handler, requestDecorator}) {
        this._handler = RequestHandler.prototype.isPrototypeOf(handler) ? handler : RequestHandler
        this._client = ClientDecorator.prototype.isPrototypeOf(client) ? client : ClientDecorator
        this._request = RequestDecorator.prototype.isPrototypeOf(requestDecorator) ? requestDecorator : RequestDecorator
    }

    create({method, uri, params, config}) {
        config instanceof Object || (config = {})
        return new this._request({...config, ...{uri, params, method}})
    }

    dispatch(request) {
        if (false === (request instanceof RequestDecorator)) {
            return
        }
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

        let resolve = data

        handlers.forEach(handler => {
            if (handler[action] instanceof Function) {
                const data = handler[action](resolve)
                data === undefined || (resolve = data)
            }
        })

        return resolve
    }

    resolveClient(client, request) {

        const handlers = this.getHandlers(request.data)
        request.data = this.resolveHandlers(request.data, handlers, 'before')

        const dataClient = request.data.stubData || client[request.data.method](request.data)
        const promise = dataClient instanceof Promise
            ? dataClient : new Promise(res => setTimeout(() => res(dataClient), 100))

        promise.then(response => {
            request.data.statusCode || (request.data.statusCode = 200)
            return this.resolveClientOnResponse(response, request)
        }).catch(error => {
            request.data.statusCode || (request.data.statusCode = 500)
            return this.resolveClientOnCatch(error, request)
        }).finally(() => {
            request.data.statusCode || (request.data.statusCode = 200)
            return this.resolveClientOnFinally(request)
        })

    }

    resolveClientOnResponse(response, request) {

        const handlers = this.getHandlers(request.data)
        this.resolveHandlers(response, handlers, 'after')

        const isSuccess = this.resolveHandlers({...response}, handlers, 'isSuccess')
        const isError = this.resolveHandlers({...response}, handlers, 'isError')

        if (isSuccess === true || (isSuccess !== true && isError !== true)) {

            request.data.success instanceof Function
                ? request.data.success(response)
                : this.resolveHandlers(response, handlers, 'onSuccess')

        } else if (isError === true) {

            request.data.error instanceof Function
                ? request.data.error(response)
                : this.resolveHandlers(response, handlers, 'onError')
        }

        return response
    }

    resolveClientOnCatch(error, request) {

        const handlers = this.getHandlers(request.data)

        if (request.data.catch instanceof Function) {
            try {
                request.data.catch(error)
            } catch (err) {
                this.resolveHandlers(err, handlers, 'onCatch')
            }
        } else {
            this.resolveHandlers(error, handlers, 'onCatch')
        }

        return error
    }

    resolveClientOnFinally(request) {

        const handlers = this.getHandlers(request.data)

        if (request.data.finally instanceof Function) {
            try {
                request.data.finally(request.data)
            } catch (err) {
                this.resolveHandlers(err, handlers, 'onCatch')
            }
        } else {
            this.resolveHandlers(request.data, handlers, 'onFinally')
        }
    }

}

export {RequestFactory}
