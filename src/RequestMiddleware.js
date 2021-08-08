import {mergeDeep, proxy} from "./helpers"
import {Request, RequestService} from "./Request"
import {RequestRepository} from "./Interfaces"

class RequestMiddleware {

    _staged = {}
    _chain = []

    _service
    _request

    _repo = null
    _repoPath = null
    _runRepo = false

    constructor(service, request = null) {

        if (false === (service instanceof RequestService))
            throw 'The RequestMiddleware`s "service" is not an instance of "RequestService".'

        if (request && false === (request instanceof Request))
            throw 'The RequestMiddleware`s "request" is not an instance of "Request".'

        this._service = service
        this._request = request

        const _proxy = (state) => proxy(state, null, (state, method, args) => {

            if (state._runRepo) {
                state._runRepo = false
                state._chain.push({method, args})
                return state._repo[method](args[0], args[1], args[2], args[3])
            }

            if (['repo', 'stub'].includes(method)) {
                state._chain.push({method, args})
                state._repo = state._service[method](args[0], args[1], args[2], args[3])
                state._repo instanceof RequestRepository && (state._repo.client = _proxy(state))
                state._repoPath = args[0]
                state._runRepo = true
                return _proxy(state)
            }

            if (state._service._factory._client.prototype[method] instanceof Function) {

                const uri = args[0]
                const params = args[1]

                if (state._request) {
                    state._request.chain = []
                    state._request.retryChainSet = []
                    state._request.data = mergeDeep(state._request.data, state._staged)
                    Object.assign(state._request.data, {
                        method,
                        uri,
                        params,
                        repo: null,
                        repoPath: null,
                        statusCode: 0,
                        dataError: null,
                        result: null,
                    })
                } else {
                    state._request = state._service._factory.create({
                        method,
                        uri,
                        params,
                        config: mergeDeep({...state._service._config}, state._staged)
                    })
                }

                Object.assign(state._request.data, {
                    repo: state._repo,
                    repoPath: state._repoPath,
                })

                const dispatcher = new state._service._dispatcher({
                    request: state._request,
                    service: state._service
                })

                state._chain.push({method, args})
                state._request.chain = state._chain
                state._request.data.retry || state._request.data.retryOnCatch || dispatcher.push()

                dispatcher.send()
                return dispatcher.fetch()

            }

            if (state[method] instanceof Function) {
                state._chain.push({method, args})
                state[method](args[0], args[1], args[2], args[3])
                return _proxy(state)
            }
        })

        return _proxy(this)
    }

    config(data) {
        data instanceof Object && (this._staged = mergeDeep(this._staged, data))
    }
}

export {RequestMiddleware}