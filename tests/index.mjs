import axios from 'axios';
import {format as prettyFormat} from 'pretty-format';

import {Request, RequestLoader, ClientDecorator, RequestHandler} from '../dist/index.js'
import RepoPosts from './repo/posts.mjs';
import RepoComments from './stubs/comments.mjs';

const _axios = (config) => axios.create(config);

class Client extends ClientDecorator {

    _endpoint = 'https://my-json-server.typicode.com/typicode/demo';

    get({headers, uri, params}) {
        return _axios({headers}).get(this._endpoint+uri, params)
    }

    post({headers, uri, params}) {
        return _axios({headers}).post(this._endpoint+uri, params)
    }

    patch({headers, uri, params}) {
        return _axios({headers}).patch(this._endpoint+uri, params)
    }

    put({headers, uri, params}) {
        return _axios({headers}).put(this._endpoint+uri, params)
    }

    delete({headers, uri, params}) {
        return _axios({headers}).delete(this._endpoint+uri, params)
    }

}

class Handler extends RequestHandler {

    _data

    constructor(data) {
        super()
        this._data = data
    }

    onCatch(error) {
        console.error(error)
    }

    isSuccess(response) {
        return true
    }

    after(response) {
        console.log(this._data.headers)

        const notifySuccess = this._data.done;
        const notifyError = this._data.alert;

        if (this.isSuccess(response) && notifySuccess) {
            console.log(notifySuccess)
        } else if (this.isError(response) && notifyError) {
            console.error(notifyError)
        }
    }

    onSuccess() {
        return 'This is a request result.'
    }

}

class Loader extends RequestLoader {

    _data

    constructor(data) {
        super()
        this._data = data
    }

    start() {
        console.log('Requests in pending status: ', this.pending)
        console.log('Request pending: ', `${this._data.method.toUpperCase()} ${this._data.uri}...`)
    }

    end() {
        console.log('Request complete: ', `${this._data.method.toUpperCase()} ${this._data.uri}.`)
    }

}

class App {

    getPosts() {
        return this.request.unlog().get('/posts').then(response => {
            console.log('posts: ',  JSON.stringify(response.data))
        }).catch(err => console.error(err))
    }

    getPostsRepo() {
        return this.request.repo('posts').getPosts().then(response => {
            console.log('posts: ',  JSON.stringify(response.data))
            throw 'Checking ApiHandler.'
        })
    }

    getCommentsStub() {
        return this.request.stub('comments').getComments().then(response => {
            console.log('comments STUB: ',  JSON.stringify(response.data))
        }).catch(err => console.error(err))
    }
}

App.prototype.request = new Request({

    getRepo: (path) => {
        console.log(path)
        return new RepoPosts
    },
    getStub: (path) => {
        console.log(path)
        return path === 'posts' ? new RepoPosts : new RepoComments
    },

    useStubs: true,
    config: {
        client: Client,
        handler: Handler,
        loader: Loader,
        useLoader: true
    },

    extend: {
        mediator: {
            awesome: function () {
                console.log('This is my awesome mediator function!')

                this.config({headers: {'X-AwesomeHeader': 'v1.0.0'}})
            },
            test1: function () {
                this.config({headers: {'X-TestHeader-1': 'v1.0.0'}})
            },
            test2: function () {
                this.config({headers: {'X-TestHeader-2': 'v1.0.0'}})
            },
        },
        request: {
            done: function (messageOnSuccess) {
                console.log(`This is what my ApiHandler would notify about at response success: `, messageOnSuccess)

                this.data.done = messageOnSuccess
                return this
            },
            alert: function (messageOnError) {
                console.log(`This is what my ApiHandler would notify about at response error: `, messageOnError)

                this.data.alert = messageOnError
                return this
            }
        }
    }

})

const app = new App();

(async () => {

    await app.getPosts()

    await app.getPostsRepo()

    await app.getCommentsStub()

    const result = await app.request.html().awesome().get('/posts').done('Wow, that`s awesome!').alert('Ooops...')

    console.error(result)

    const log = app.request.getLog()
    console.log('requests logged number: ', log.length)

    await app.request.bg().html().encode().repo('posts').getPosts()

    const chain = []
    log.forEach(r => chain.push(r.chain.map(i => i.method)))
    console.log(prettyFormat(chain))

})();


