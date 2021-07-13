class RequestRepository {
    client
}

class RequestHandler {

    /*
    * request checking method
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Boolean on Success
    * */
    isSuccess() {
    }

    /*
    * request checking method
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Boolean on Error
    * */
    isError() {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Anything on Success
    * */
    onSuccess() {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return Anything on Error
    * */
    onError() {
    }

    /*
    * method executes within a Promise.prototype.catch()
    * @params: error
    * */
    onCatch() {
    }

    /*
    * method executes within a Promise.prototype.finally()
    * @params: request data
    * */
    onFinally() {
    }

    /*
    * method calls before request send
    * @params: request data
    * @return modified request data
    * */
    before() {
    }

    /*
    * method calls on incoming response data
    * @params: response data
    * @return modified response data
    * */
    after() {
    }
}

export {RequestHandler, RequestRepository}
