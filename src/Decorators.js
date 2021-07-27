import {proxy} from './helpers'

class ClientDecorator {

    async get() {
    }

    async post() {
    }

    async patch() {
    }

    async put() {
    }

    async delete() {
    }

}

class RequestDecorator {

    data = {}

    _chain = []

    constructor(data) {
        this.data = data

        const _proxy = (state) => proxy(state, ['data'], (state, method, args) => {

            if (method === 'chainPush') return state.chainPush(args[0])

            state.chainPush({method, args})

            if (method === 'await') return state.await()

            state[method](args[0], args[1], args[2], args[3])

            return _proxy(state)
        })

        return _proxy(this)
    }

    chainPush({method, args}) {
        this._chain.push({method, args})
    }

    success(callback) {
        this.data.success = callback
    }

    then(callback) {
        this.data.success = callback
    }

    error(callback) {
        this.data.error = callback
    }

    catch(callback) {
        this.data.catch = callback
    }

    finally(callback) {
        this.data.finally = callback
    }

    /*
    * This method should be called at the end as it returns a new Promise.
    * @return: {result, statusCode}
    * */
    await() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.data.statusCode) {
                    clearInterval(interval)
                    setTimeout(() => resolve({result: this.data.result, statusCode: this.data.statusCode}), 10)
                }
            }, 1)
        })
    }

}

export {RequestDecorator, ClientDecorator}
