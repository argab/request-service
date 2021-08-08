import {RequestFactory} from "./RequestFactory"
import {RequestMiddleware} from "./RequestMiddleware"
import {RequestMiddlewareDecorator} from "./Decorators"
import {RequestDispatcher} from "./RequestDispatcher"
import {RequestRetry} from "./RequestRetry"
import {proxy, isPrototype} from "./helpers"

class AbstractRequest {

    _requests = []
    _factory
    _dispatcher
    _middleware
    _retry

    _getRepo
    _getStub
    _useStubs

    _config = {
        handler: null,
        client: null,
        repo: null,
        repoPath: null,
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
        retry: null,
        retryOnCatch: null,
        retryChain: null,
        retryMaxCount: 0,
        retryTimeout: 0,
        retryCount: 0,
        dataError: null,
        result: null,
        log: true
    }

    _extend = {
        middleware: null,
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

class RequestService extends AbstractRequest {

    constructor({config, getRepo, getStub, useStubs, extend, factory, dispatcher, middleware, requestDecorator, requestRetry}) {
        super()
        this._getRepo = getRepo instanceof Function ? getRepo : () => null
        this._getStub = getStub instanceof Function ? getStub : () => null
        this._useStubs = Boolean(useStubs)
        this._factory = isPrototype(RequestFactory, factory) ? factory : RequestFactory
        this._dispatcher = isPrototype(RequestDispatcher, dispatcher) ? dispatcher : RequestDispatcher
        this._middleware = isPrototype(RequestMiddleware, middleware) ? middleware : RequestMiddlewareDecorator
        this._retry = isPrototype(RequestRetry, requestRetry) ? requestRetry : RequestRetry

        config instanceof Object && Object.assign(this._config, config)
        extend instanceof Object && Object.assign(this._extend, extend)

        this._factory = new this._factory({requestDecorator, service: this})

        const _extend = this.extends().middleware
        _extend instanceof Object && Object.keys(_extend).forEach(key => {
            this._middleware.prototype[key] = _extend[key]
        })

        return proxy(this, null, (state, method, args) => {
            if (false === ['repo', 'stub'].includes(method) && state[method] instanceof Function) {
                return state[method](args[0])
            }
            return new state._middleware(state)[method](args[0], args[1], args[2], args[3])
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

class Request {

    data = {}
    chain = []
    retryChainSet = []

    _methods = ['retry', 'retryOnCatch', 'retryChain', 'retryMaxCount', 'retryTimeout']

    constructor(data) {
        this.data = data
    }

    /*
    * This method doesn't restarts the request, it brings the Function that
    * takes the request data as an argument and initiates the request restarting method.
    * The Function executes at the end of a Promise.prototype.finally()
    * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
    * returning Boolean that whenever is TRUE then restarts the request
    * @return: void
    * */
    retry(resolve) {
        this.data.retry = resolve
    }

    /*
    * The request retry error handler.
    * The Function executes at the end of a Promise.prototype.finally()
    * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
    * returning Boolean that whenever is TRUE then restarts the request
    * @return: void
    * */
    retryOnCatch(resolve) {
        this.data.retryOnCatch = resolve
    }

    /*
    * Overrides the current request`s methods call chain on retry.
    * The Function executes within a retry method.
    * @example: ....retryChain(({set}) => set.json()
    *   .post('http://some.url', {params})
    *   .success(...).error(...).catch(...))
    * @param: {Function}({set, chain, data}):<void|Array>
    *     - @property "set" creates a new set
    *       of the current request`s methods call
    *       staged as an Array in a property named "retryChainSet".
    *     - @property "chain" provides an Array
    *       [{method, args}, {method, args}, ....]
    *       containing the current request`s methods call chain.
    *     - @property "data" - current request`s data.
    * @return: void
    * */
    retryChain(callback) {
        this.data.retryChain = callback
    }

    /*
    * Sets a max number of retry attempts
    * @param: {Number}
    * @return: void
    * */
    retryMaxCount(count) {
        this.data.retryMaxCount = Number.isNaN(+count) ? 0 : +count
    }

    /*
    * Sets the timeout between retry attempts
    * @param: {Number}
    * @return: void
    * */
    retryTimeout(miliseconds) {
        this.data.retryTimeout = Number.isNaN(+miliseconds) ? 0 : +miliseconds
    }

}


export {RequestService, Request, AbstractRequest}
