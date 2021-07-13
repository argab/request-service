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

    constructor(request) {
        this.data = request
    }

    success(callback) {
        this.data.success = callback
        return this
    }

    then(callback) {
        this.data.success = callback
        return this
    }

    error(callback) {
        this.data.error = callback
        return this
    }

    catch(callback) {
        this.data.catch = callback
        return this
    }

    finally(callback) {
        this.data.finally = callback
        return this
    }

    done(messageOnSuccess) {
        this.data.done = messageOnSuccess
        return this
    }

    alert(messageOnError) {
        this.data.alert = messageOnError
        return this
    }

}

export {RequestDecorator, ClientDecorator}
