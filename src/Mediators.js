import {mergeDeep} from "./helpers"

class RequestMediator {

    staged = {}

    constructor(stagedData) {
        stagedData instanceof Object && (this.staged = stagedData)
    }

    config(data) {
        data instanceof Object && (this.staged = mergeDeep(this.staged, data))
    }

    stubData(stubData) {
        this.config({stubData})
    }

    unlog() {
        this.config({log: false})
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

    bg() {
        this.config({useLoader: false})
    }

}

export {RequestMediator, RequestMediatorDecorator}
