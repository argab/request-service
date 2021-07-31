import {RequestFactory} from "./RequestFactory"
import {RequestMediator, RequestMediatorDecorator} from "./Mediators"
import {proxy, isPrototype} from "./helpers"

class AbstractRequest {

    _requests = []
    _factory
    _mediator

    _getRepo
    _getStub
    _useStubs

    _config = {
        handler: null,
        client: null,
        loader: null,
        useLoader: false,
        stubData: null,
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        uri: '',
        params: {},
        method: 'get',
        statusCode: 0,
        success: null,
        error: null,
        finally: null,
        catch: null,
        dataError: null,
        result: null,
        log: true
    }

    _extend = {
        mediator: null,
        request: null
    }

    repo() {
    }

    stub() {
    }

    getLog() {
    }

    log() {
    }

    extends() {
    }

}

class Request extends AbstractRequest {

    constructor({config, getRepo, getStub, useStubs, factory, mediator, extend}) {
        super()
        this._getRepo = getRepo instanceof Function ? getRepo : () => null
        this._getStub = getStub instanceof Function ? getStub : () => null
        this._useStubs = Boolean(useStubs)
        this._factory = isPrototype(RequestFactory, factory) ? factory : RequestFactory
        this._mediator = isPrototype(RequestMediator, mediator) ? mediator : RequestMediatorDecorator

        config instanceof Object && Object.assign(this._config, config)
        extend instanceof Object && Object.assign(this._extend, extend)

        return proxy(this, null, (state, method, args) => {

            const extend = state.extends().mediator
            extend instanceof Object && Object.keys(extend).forEach(key => {
                state._mediator.prototype[key] = extend[key]
            })

            const isRepo = ['repo', 'stub'].includes(method)

            if (false === isRepo && state[method] instanceof Function) {
                return state[method](args[0])
            }

            if (isRepo || state._mediator.prototype[method] instanceof Function) {
                const mediator = new state._mediator(state, state._factory)
                return mediator[method](args[0], args[1], args[2], args[3])
            }
        })
    }

    repo(path) {
        if (this._useStubs) {
            const stub = this.stub(path)
            if (stub) return stub
        }
        return this._getRepo(path)
    }

    stub(path) {
        return this._getStub(path)
    }

    getLog() {
        return this._requests
    }

    log(request) {
        this._requests.push(request)
    }

    extends() {
        return {...this._extend}
    }
}


export {Request, AbstractRequest}
