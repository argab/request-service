import {mergeDeep, proxy, applyCall} from "./helpers"
import {Request, RequestService} from "./Request"
import {RequestRepository} from "./Interfaces"

class RequestMiddleware {

    _staged = {}
    _service
    _request

    #repo = {
        instance: null,
        path: null,
        method: null,
        run: false,
    }

    #chain = []

    constructor(service, request = null) {

        if (!(service instanceof RequestService)) throw 'The RequestMiddleware`s "service" is not an instance of "RequestService".'
        if (request && !(request instanceof Request)) throw 'The RequestMiddleware`s "request" is not an instance of "Request".'

        this._service = service
        this._request = request

        return this.#proxy()
    }

    config(data) {
        data instanceof Object && (this._staged = mergeDeep(this._staged, data))
    }

    #proxy() {

        return proxy(this, null, (state, method, args) => {

            const runRepo = state.#runRepo(method, args)

            if (runRepo) return runRepo

            const client = state._staged.client || state._request?.data.client || state._service._config.client

            if (state._service._factory.getClientPrototype({client}).prototype[method] instanceof Function) {

                return this.#runManager(method, args)
            }

            if (state[method] instanceof Function) {

                state.#chain.push({method, args})

                applyCall(state, method, args)

                return state.#proxy()
            }
        })
    }

    #runRepo(method, args) {

        if (this.#repo.run) {
            this.#repo.run = false
            this.#repo.method = method
            this.#chain.push({method, args})
            return applyCall(this.#repo.instance, method, args)
        }

        if (['repo', 'stub'].includes(method)) {
            this.#chain.push({method, args})
            this.#repo.instance = applyCall(this._service, method, args)
            this.#repo.instance instanceof RequestRepository && (this.#repo.instance.client = this.#proxy())
            this.#repo.path = args[0]
            this.#repo.run = true
            return this.#proxy()
        }
    }

    #runManager(method, args) {

        this._request = this._service._factory.createOrAssign(this._request, {
            ...this._staged,
            uri: args[0],
            params: args[1],
            method
        }, mergeDeep({...this._service._config}, this._staged))

        Object.assign(this._request.data, {
            repo: this.#repo.instance,
            repoPath: this.#repo.path,
            repoMethod: this.#repo.method
        })

        const manager = new this._service._manager({
            request: this._request,
            service: this._service
        })

        this.#chain.push({method, args})
        this._request.chain = this.#chain
        this._request._fetch || manager.save()

        manager.send()

        return manager.fetch()
    }
}

export {RequestMiddleware}
