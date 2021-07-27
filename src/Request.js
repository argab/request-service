import {RequestRepository} from "./Interfaces"
import {RequestFactory} from "./RequestFactory"
import {RequestMediator, RequestMediatorDecorator} from "./Mediators"
import {mergeDeep} from "./helpers"

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

}

class Request extends AbstractRequest {

    constructor({config, getRepo, getStub, useStubs, factory, mediator, extend}) {
        super()
        this._getRepo = getRepo instanceof Function ? getRepo : () => null
        this._getStub = getStub instanceof Function ? getStub : () => null
        this._useStubs = Boolean(useStubs)
        this._factory = RequestFactory.isPrototypeOf(factory) ? factory : RequestFactory
        this._mediator = RequestMediator.isPrototypeOf(mediator) ? mediator : RequestMediatorDecorator

        config instanceof Object && Object.assign(this._config, config)
        extend instanceof Object && Object.assign(this._extend, extend)

        return this._proxy()
    }

    repo(path) {
        if (this._useStubs) {
            const stub = this.stub(path)
            if (stub) {
                return stub
            }
        }
        const repo = this._getRepo(path)
        repo instanceof RequestRepository && (repo.client = this._proxy())
        return repo
    }

    stub(path) {
        const repo = this._getStub(path)
        repo instanceof RequestRepository && (repo.client = this._proxy())
        return repo
    }

    getLog() {
        return this._requests
    }

    _proxy(stagedData, chain) {
        return new Proxy(this, {
            get: function (Req, method) {
                return function (...args) {

                    if (Req[method] instanceof Function) return Req[method](args[0])

                    stagedData instanceof Object || (stagedData = {})
                    Array.isArray(chain) || (chain = [])

                    if (RequestMediator.isPrototypeOf(Req._mediator)) {
                        const extend = Req._extend.mediator
                        extend instanceof Object && Object.keys(extend).forEach(key => {
                            Req._mediator.prototype[key] = extend[key]
                        })
                        if (Req._mediator.prototype[method] instanceof Function) {
                            const mediator = new Req._mediator(stagedData)
                            mediator[method](args[0], args[1], args[2], args[3])
                            chain.push({method, args})
                            return Req._proxy(mediator.staged, chain)
                        }
                    }

                    stagedData.requestService || Object.assign(stagedData, {requestService: Req})

                    const factory = new Req._factory(stagedData)

                    if (factory instanceof RequestFactory && factory._client.prototype[method] instanceof Function) {
                        const uri = args[0]
                        const params = args[1]
                        const request = factory.create({
                            method,
                            uri,
                            params,
                            config: mergeDeep({...Req._config}, stagedData)
                        })

                        chain.push({method, args})
                        chain.forEach(item => request.chainPush(item))

                        request.data.log && Req._requests.push(request)
                        return factory.dispatch(request)
                    }
                }
            }
        })
    }
}


export {Request, AbstractRequest}
