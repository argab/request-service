import {RequestClient, RequestHandler, RequestLoader} from "./Interfaces"
import {AbstractRequest, Request} from "./Request"
import {isPrototype} from "./helpers"

class RequestFactory {

    _handler
    _client
    _request
    _service

    constructor({client, handler, request, service}) {
        this._handler = isPrototype(RequestHandler, handler) ? handler : RequestHandler
        this._client = isPrototype(RequestClient, client) ? client : RequestClient
        this._request = isPrototype(Request, request) ? request : Request
        AbstractRequest.prototype.isPrototypeOf(Object.getPrototypeOf(service || {})) && (this._service = service)
    }

    create({method, uri, params, config}) {

        const request = new this._request({...config, ...{uri, params, method}})

        if (this._service) {
            const extend = this._service.extends().request
            extend instanceof Object && Object.keys(extend).forEach(key => {
                request._methods.push(key)
                request[key] = extend[key]
            })
        }

        return request
    }

    getClient(data) {
        const client = this.getClientPrototype(data)
        return new client(data)
    }

    getClientPrototype(data) {
        return isPrototype(RequestClient, data.client) ? data.client : this._client
    }

    getHandlers(data, appendDataFunc) {

        const output = []

        let handlers = data.handler || this._handler
        Array.isArray(handlers) || (handlers = [handlers])
        handlers.forEach(handler => {
            if (isPrototype(RequestHandler, handler)) {
                appendDataFunc instanceof Function && appendDataFunc(handler)
                output.push(new handler(data))
            }
        })

        return output
    }

    getLoader(data) {
        return data.useLoader && isPrototype(RequestLoader, data.loader) ? new data.loader(data) : null
    }
}

export {RequestFactory}
