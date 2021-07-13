import {ClientDecorator, RequestDecorator} from "./Decorators"
import {RequestHandler} from "./Interfaces"
import {Request} from "./Request"

class RequestFactory {

    _handler
    _client
    _request

    constructor({client, handler, requestDecorator}) {
        this._handler = handler instanceof RequestHandler ? handler : RequestHandler
        this._client = client instanceof ClientDecorator ? client : ClientDecorator
        this._request = requestDecorator instanceof RequestDecorator ? requestDecorator : RequestDecorator

        this._request = Request._setPrototypeOf(this._request, requestDecorator)
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
        let client = data.client instanceof ClientDecorator ? data.client : this._client
        client = Request._setPrototypeOf(client, data.client)
        return new client(data)
    }

    getHandlers(data) {

        const output = []
        let handlers = data.handler || this._handler
        Array.isArray(handlers) || (handlers = [handlers])

        handlers.forEach(hr => {
            let handler = hr instanceof RequestHandler ? hr : this._handler
            handler = Request._setPrototypeOf(handler, hr)
            output.push(new handler(data))
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

        const dataClient = client[request.data.method](request.data)
        const promise = dataClient instanceof Promise
            ? dataClient : new Promise(res => setTimeout(() => res(dataClient), 100))

        promise.then(response => {
            return this.resolveClientOnResponse(response, request)
        }).catch(error => {
            return this.resolveClientOnCatch(error, request)
        }).finally(() => {
            return this.resolveClientOnFinally(request)
        })

    }

    resolveClientOnResponse(response, request) {

        const handlers = this.getHandlers(request.data)
        this.resolveHandlers(response, handlers, 'after')

        const isSuccess = this.resolveHandlers({...response}, handlers, 'isSuccess')
        const isError = this.resolveHandlers({...response}, handlers, 'isError')

        if (isSuccess === true || (isSuccess === undefined && !isError)) {

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
            } catch(err) {
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
            } catch(err) {
                this.resolveHandlers(err, handlers, 'onCatch')
            }
        } else {
            this.resolveHandlers(request.data, handlers, 'onFinally')
        }
    }

}

export {RequestFactory}
