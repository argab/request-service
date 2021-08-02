import {RequestResolve} from "./Interfaces"

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

class RequestDecorator extends RequestResolve {

    data = {}
    chain = []

    constructor(data) {
        super()
        this.data = data
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

}

export {RequestDecorator, ClientDecorator}
