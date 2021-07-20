import {RequestRepository} from "./Interfaces"
import {RequestFactory} from "./RequestFactory"
import {RequestMediator, RequestMediatorDecorator} from "./Mediators"

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
    }

    _extend = {
        mediator: null,
        request: null
    }

    repo() {
    }

    stub() {
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

    _proxy(stagedData) {
        return new Proxy(this, {
            get: function (Req, method) {
                return function (...props) {

                    const stub = (path) => {
                        const repo = Req._getStub(path)
                        repo instanceof RequestRepository && (repo.client = Req._proxy())
                        return repo
                    }

                    const repo = (path) => {
                        if (Req._useStubs) {
                            const _stub = stub(path)
                            if (_stub) {
                                return _stub
                            }
                        }
                        const repo = Req._getRepo(path)
                        repo instanceof RequestRepository && (repo.client = Req._proxy())
                        return repo
                    }

                    if (method === 'repo') {
                        return repo(props[0])
                    }

                    if (method === 'stub') {
                        return stub(props[0])
                    }

                    stagedData instanceof Object || (stagedData = {})

                    if (RequestMediator.isPrototypeOf(Req._mediator)) {
                        const extend = Req._extend.mediator
                        extend instanceof Object && Object.keys(extend).forEach(key => {
                            Req._mediator.prototype[key] = extend[key]
                        })
                        if (Req._mediator.prototype[method] instanceof Function) {
                            const mediator = new Req._mediator(stagedData)
                            mediator[method](props[0])
                            return Req._proxy(mediator.staged)
                        }
                    }

                    stagedData.requestService || Object.assign(stagedData, {requestService: Req})

                    const factory = new Req._factory(stagedData)

                    if (factory instanceof RequestFactory && factory._client.prototype[method] instanceof Function) {
                        const data = Req._config
                        const uri = props[0]
                        const params = props[1]
                        const config = props[2] instanceof Object ? props[2] : {}
                        const request = factory.create({
                            method,
                            uri,
                            params,
                            config: {...data, ...config, ...stagedData}
                        })

                        Req._requests.push(request)

                        return factory.dispatch(request)
                    }
                }
            }
        })
    }
}


export {Request, AbstractRequest}
