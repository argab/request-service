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

    constructor(data) {
        this.data = data
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

    /*
    * This method should be called at the end as it returns a new Promise.
    * @return: {result, statusCode}
    * */
    await() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.data.statusCode) {
                    resolve({result: this.data.result, statusCode: this.data.statusCode})
                    clearInterval(interval)
                }
            }, 100)
        })
    }

}

export {RequestDecorator, ClientDecorator}
