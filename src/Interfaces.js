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
    * response checking method
    * method executes within a Promise.prototype.then()
    * @param: incoming response data
    * @return: Boolean
    * */
    isSuccess() {
    }

    /*
    * response checking method
    * method executes within a Promise.prototype.then()
    * @param: incoming response data
    * @return: Boolean
    * */
    isError() {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @param: incoming response data
    * @return: void
    * */
    onSuccess() {
    }

    /*
    * method executes within a Promise.prototype.then()
    * @param: incoming response data
    * @return: void
    * */
    onError() {
    }

    /*
    * method executes within a Promise.prototype.catch()
    * @param: error
    * @return: void
    * */
    onCatch() {
    }

    /*
    * method executes within a Promise.prototype.finally()
    * @param: request data
    * @return: void
    * */
    onFinally() {
    }

    /*
    * method executes before request sent
    * @param: request data
    * @return: void
    * */
    before() {
    }

    /*
    * method executes at the start of a Promise.prototype.then()
    * @param: response
    * @return: void
    * */
    after() {
    }

    /*
    * method executes at the start of a Promise.prototype.catch()
    * @param: error
    * @return: void
    * */
    afterCatch() {
    }

    /*
    * method executes at the start of a Promise.prototype.finally()
    * @param: request data
    * @return: void
    * */
    afterFinally() {
    }
}

class RequestResolve {

    requestResolveMethods = [
        'success', 'then', 'error', 'catch', 'finally'
    ]

}

export {RequestHandler, RequestRepository, RequestLoader, RequestResolve}
