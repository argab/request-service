class RequestClient {

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

class RequestRepository {

    /*
    * @property: {Object} An Instance of the Request implementing AbstractRequest
    * @return: new Proxy
    * */
    client
}

class RequestLoader {

    /*
    * @property: {Number} Displays a number of requests that uses Loader and having pending status
    * */
    pending

    start() {
    }

    end() {
    }

}

class RequestHandler {

    /*
    * response checking method
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: Boolean
    * */
    isSuccess(response) {
    }

    /*
    * response checking method
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: Boolean
    * */
    isError(response) {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: void
    * */
    onSuccess(response) {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @param: {Object} incoming response data
    * @return: void
    * */
    onError(response) {
    }

    /*
    * method executes within a Promise.prototype.catch()
    * @param: {Object} error
    * @return: void
    * */
    onCatch(error) {
    }

    /*
    * method executes within a Promise.prototype.finally()
    * @param: {Object} request data
    * @return: void
    * */
    onFinally(data) {
    }

    /*
    * method executes before request sent
    * @param: {Object} request data
    * @return: void
    * */
    before(data) {
    }

    /*
    * method executes at the start of a Promise.prototype.then()
    * @param: {Object} response
    * @return: void
    * */
    after(response) {
    }

    /*
    * method executes at the start of a Promise.prototype.catch()
    * @param: {Object} error
    * @return: void
    * */
    afterCatch(error) {
    }

    /*
    * method executes at the start of a Promise.prototype.finally()
    * @param: {Object} request data
    * @return: void
    * */
    afterFinally(data) {
    }

    /*
    * (This method is Abstract (Not subject to redeclare))
    * The request restarting method.
    * @param: {Boolean}|{Function}(data):<Boolean|Promise> Boolean or a Function returning both Boolean or a Promise
    * returning Boolean that whenever is TRUE then restarts the request.
    * @return: void
    * */
    retry(resolve) {
    }
}

export {RequestHandler, RequestRepository, RequestLoader, RequestClient}
