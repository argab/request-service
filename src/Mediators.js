class RequestMediator {

    staged = {}

    constructor(stagedData) {
        this.staged = stagedData instanceof Object ? stagedData : {}
    }

    config(data) {
        data instanceof Object && Object.assign(this.staged, data)
    }

    stubData(stubData) {
        this.config({stubData})
    }

}

class RequestMediatorDecorator extends RequestMediator {

    constructor(stagedData) {
        super(stagedData)
    }

    headers(headers) {
        this.config({headers})
    }

    encode() {
        this.config({headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    }

    form() {
        this.config({headers: {'Content-Type': 'multipart/form-data'}})
    }

    json() {
        this.config({headers: {'Content-Type': 'application/json;charset=UTF-8'}})
    }

    html() {
        this.config({headers: {'Accept': 'text/html'}})
    }

    useLoader(useLoader = true) {
        this.config({useLoader: Boolean(useLoader)})
    }

}

export {RequestMediator, RequestMediatorDecorator}
