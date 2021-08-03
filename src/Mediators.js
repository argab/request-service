import {mergeDeep, proxy, isPrototype} from "./helpers"
import {AbstractRequest} from "./Request"
import {RequestFactory} from "./RequestFactory"
import {RequestRepository} from "./Interfaces"

const resolveRequest = (state) => {

    const resolvePromise = new Promise(resolve => {
        const interval = setInterval(() => {
            if (state.data.statusCode) {
                clearInterval(interval)
                setTimeout(() => resolve(state.data.result), 10)
            }
        }, 1)
    })

    state.requestResolveMethods.forEach(method => state[method] instanceof Function && (resolvePromise[method] = (arg) => {
        state.chain.push({method, args: [arg]})
        state[method](arg)
        return resolvePromise
    }))

    return resolvePromise
}

class RequestMediator {

    _staged = {}
    _chain = []

    constructor(Service, Factory) {

        if (false === (Service instanceof AbstractRequest))
            throw 'The RequestMediator`s "service" is not an instance of "AbstractRequest".'

        if (false === isPrototype(RequestFactory, Factory))
            throw 'The RequestMediator`s "factory" is not a prototype of "RequestFactory.prototype".'

        const _proxy = (state) => proxy(state, null, (state, method, args) => {

            const staged = state._staged
            const requestService = staged.requestService || Service
            const requestDecorator = staged.requestDecorator
            const handler = staged.handler
            const client = staged.client

            staged.requestService && delete staged.requestService
            staged.requestDecorator && delete staged.requestDecorator

            if (['repo', 'stub'].includes(method)) {
                const Repo = Service[method](args[0], args[1], args[2], args[3])
                Repo instanceof RequestRepository && (Repo.client = _proxy(state))
                return Repo
            }

            if (state[method] instanceof Function) {
                state._chain.push({method, args})
                state[method](args[0], args[1], args[2], args[3])
                return _proxy(state)
            }

            const factory = new Factory({handler, client, requestService, requestDecorator})

            if (factory._client.prototype[method] instanceof Function) {
                const uri = args[0]
                const params = args[1]
                const request = factory.create({
                    method,
                    uri,
                    params,
                    config: mergeDeep({...Service._config}, staged)
                })

                state._chain.push({method, args})
                request.chain = state._chain

                request.data.log && Service.log(request)
                factory.dispatch(request)

                return resolveRequest(request)
            }
        })

        return _proxy(this)
    }

    config(data) {
        data instanceof Object && (this._staged = mergeDeep(this._staged, data))
    }
}

class RequestMediatorDecorator extends RequestMediator {

    stubData(stubData) {
        this.config({stubData})
    }

    unlog() {
        this.config({log: false})
    }

    headers(headers) {
        this.config({headers})
    }

    encode() {
        this.config({headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    }

    form() {
        this.config({headers: {'Content-Type': 'multipart/form-data'}})
    }

    json() {
        this.config({headers: {'Content-Type': 'application/json;charset=UTF-8'}})
    }

    html() {
        this.config({headers: {'Accept': 'text/html'}})
    }

    stream() {
        this.config({headers: {'Content-Type': 'application/octet-stream'}})
    }

    useLoader(useLoader = true) {
        this.config({useLoader: Boolean(useLoader)})
    }

    bg() {
        this.config({useLoader: false})
    }

}

export {RequestMediator, RequestMediatorDecorator}
