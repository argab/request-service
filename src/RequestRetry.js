import {Request, RequestService} from "./Request"
import {proxy} from "./helpers"

class RequestRetry {

    request
    service
    resolve

    constructor({request, service, resolve}) {

        if (false === (request instanceof Request))
            throw 'The RequestRetry`s "request" is not an instance of "Request".'
        if (false === (service instanceof RequestService))
            throw 'The RequestRetry`s "service" is not an instance of "RequestService".'

        this.request = request
        this.service = service
        this.resolve = resolve

        const maxCount = this.request.data.retryMaxCount
        const timeout = this.request.data.retryTimeout
        const retryCount = this.request.data.retryCount

        this.request.data.retryMaxCount = Number.isNaN(+maxCount) ? 0 : +maxCount
        this.request.data.retryTimeout = Number.isNaN(+timeout) ? 0 : +timeout
        this.request.data.retryCount = Number.isNaN(+retryCount) ? 0 : +retryCount

    }

    async getRetry() {

        const request = this.request

        let resolve

        if (this.resolve !== undefined) {
            resolve = this.resolve
        } else {
            resolve = request.data.retryOnCatch && request.data.dataError ? request.data.retryOnCatch : null
            resolve === null && (resolve = request.data.retry || null)
        }

        const retry = resolve instanceof Function ? resolve(request.data) : resolve
        return retry instanceof Promise ? await retry : retry
    }

    retryChain() {
        this.setRetryChain()
        const request = this.request
        const chain = request.chain
        const middleware = new this.service._middleware(this.service, request)

        request.chain = []

        let pipe = middleware[chain[0].method](chain[0].args[0], chain[0].args[1], chain[0].args[2], chain[0].args[3])

        chain.shift()
        chain.forEach(({method, args}) => {
            pipe[method] instanceof Function && (pipe = pipe[method](args[0], args[1], args[2], args[3]))
        })
    }

    setRetryChain() {
        const request = this.request
        const set = proxy({}, null, (state, method, args) => {
            request.chain.push({method, args})
            return set
        })

        if (request.data.retryChain instanceof Function) {
            const chain = [...request.chain]
            request.chain = []
            const _chain = request.data.retryChain({set, chain, data: request.data})
            Array.isArray(_chain) && (request.chain = _chain)
            request.chain.length || (request.chain = chain)
        }
    }

    async retry() {

        const request = this.request
        const retryMaxCount = request.data.retryMaxCount
        const retryCount = request.data.retryCount

        if (retryMaxCount && retryCount >= retryMaxCount) return request._resolve()

        const retry = await this.getRetry(request)

        if (Boolean(retry) === false) return request._resolve()

        Object.assign(request.data, {
            repo: null,
            repoPath: null,
            repoMethod: null,
            statusCode: 0,
            retry: request.data.retry,
            retryOnCatch: request.data.retryOnCatch,
            retryCount: retryCount + 1,
            retryMaxCount,
            dataError: null,
            result: null,
        })

        setTimeout(() => this.retryChain(), request.data.retryTimeout)
    }

}

export {RequestRetry}
