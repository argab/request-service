class RequestRepository {

    /*
    * @property: Object: An Instance of the Request implementing AbstractRequest
    * @return: new Proxy
    * */
    client
}

class RequestLoader {

    /*
    * @property: Number: Displays a number of requests that uses Loader and having pending status
    * */
    pending

    start() {
    }

    end() {
    }

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
    * @return: void
    * */
    onSuccess() {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @params: incoming response data
    * @return: void
    * */
    onError() {
    }

    /*
    * method executes within a Promise.prototype.catch()
    * @params: error
    * @return: void
    * */
    onCatch() {
    }

    /*
    * method executes within a Promise.prototype.finally()
    * @params: request data
    * @return: void
    * */
    onFinally() {
    }

    /*
    * method executes before request sent
    * @params: request data
    * @return: void
    * */
    before() {
    }

    /*
    * method executes at the start of a Promise.prototype.then()
    * @params: response
    * @return: void
    * */
    after() {
    }

    /*
    * method executes at the start of a Promise.prototype.catch()
    * @params: error
    * @return: void
    * */
    afterCatch() {
    }

    /*
    * method executes at the start of a Promise.prototype.finally()
    * @params: request data
    * @return: void
    * */
    afterFinally() {
    }
}

export {RequestHandler, RequestRepository, RequestLoader}
