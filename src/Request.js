import {RequestRepository} from "./Interfaces"
import {RequestFactory} from "./RequestFactory"
import {RequestMediator, RequestMediatorDecorator} from "./Mediators"
import {ClientDecorator} from "./Decorators"

class Request {

    _requests = []
    _factory
    _mediator

    _getRepo
    _getStub
    _useStubs

    _config = {
        handler: null,
        client: null,
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        uri: '',
        params: {},
        method: 'get',
        success: null,
        error: null,
        finally: null,
        catch: null,
        done: null,
        alert: null,
        useLoader: false
    }

    constructor({config, getRepo, getStub, useStubs, factory, mediator: mediator = RequestMediatorDecorator}) {
        this._getRepo = getRepo instanceof Function ? getRepo : () => null
        this._getStub = getStub instanceof Function ? getStub : () => null
        this._useStubs = Boolean(useStubs)
        this._factory = factory instanceof RequestFactory ? factory : RequestFactory
        this._mediator = mediator instanceof RequestMediator ? mediator : RequestMediatorDecorator

        config instanceof Object && Object.assign(this._config, config)

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
        repo instanceof RequestRepository && (repo.client = this)
        return repo
    }

    stub(path) {
        const repo = this._getStub(path)
        repo instanceof RequestRepository && (repo.client = this)
        return repo
    }

    _proxy(stagedData) {
        return new Proxy(this, {
            get: function (Req, method) {
                return function (...props) {

                    stagedData instanceof Object || (stagedData = {})

                    let mediator = Req._mediator
                    mediator = Request._setPrototypeOf(mediator, Req._mediator)
                    mediator = new mediator(stagedData)

                    if (mediator instanceof RequestMediator && mediator[method] instanceof Function) {
                        mediator[method](props[0])
                        return Req._proxy(mediator.staged)
                    }

                    const factory = typeof Req._factory.prototype === 'undefined' ? Req._factory : new Req._factory({
                        client: stagedData.client || Req._config.client,
                        handler: stagedData.handler || Req._config.handler
                    })

                    if (factory._client instanceof ClientDecorator && factory._client[method] instanceof Function) {
                        const data = Req._config
                        const uri = props[0]
                        const params = props[1]
                        const config = props[2] instanceof Object ? props[2] : {}
                        const request = factory.create({method, uri, params, config: {...data, ...config, ...stagedData}})
                        Req._requests.push(request)
                        return factory.dispatch(request)
                    }
                }
            }
        })
    }

    static _setPrototypeOf(subject, target) {
        if (typeof subject.prototype === 'undefined') {
            subject = function () {
            }
            subject.prototype = Object.getPrototypeOf(target)
        }
        return subject
    }

}

export {Request}
