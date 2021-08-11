import {RequestMiddleware} from "./RequestMiddleware"

class RequestMiddlewareDecorator extends RequestMiddleware {

    stubData(stubData) {
        this.config({stubData})
    }

    unlog() {
        this.config({log: false})
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

    stream() {
        this.config({headers: {'Content-Type': 'application/octet-stream'}})
    }

    useLoader(useLoader = true) {
        this.config({useLoader: Boolean(useLoader)})
    }

    bg() {
        this.config({useLoader: false})
    }

}


export {RequestMiddlewareDecorator}
