import axios from 'axios'

import {Request, RequestRepository, ClientDecorator, RequestDecorator, RequestMediator, RequestMediatorDecorator, RequestHandler, RequestFactory} from '../dist/index.js'
import RepoPosts from './repo/posts.mjs';
import PostsStub from './stubs/posts.mjs';


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

    onCatch(error) {
        console.error(error)
    }

}

class App {

    getPosts() {
        return this.request.get('/posts').then(response => {
            console.log('posts: ',  JSON.stringify(response.data))
        }).catch(err => console.error(err)).await()
    }

    getPostsRepo() {
        return this.request.repo('posts').getPosts().then(response => {
            console.log('posts: ',  JSON.stringify(response.data))
        }).catch(err => console.error(err)).await()
    }

    getPostsStub() {
        return this.request.stub('posts').getPosts().then(response => {
            console.log('posts: ',  JSON.stringify(response.data))
        }).catch(err => console.error(err)).await()
    }
}

App.prototype.request = new Request({

    getRepo: (path) => {
        console.log(path)
        return new RepoPosts()
    },
    getStub: (path) => {
        console.log(path)
        return new PostsStub()
    },

    useStubs: false,
    config: {
        client: Client,
        handler: Handler,
    }

})

const app = new App();

(async () => {

    await app.getPosts();

    await app.getPostsRepo();

    await app.getPostsStub()


})();


