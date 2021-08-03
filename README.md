# Request Service

Provides a fully customizable Library for handling API using Request repositories and Stubs.

## Initialisation

1. Create your own ES-6 classes extending "ClientDecorator" and "RequestHandler" from the package.

```javascript
//.......... ApiClient.js

import {ClientDecorator} from '@argab/request-service'
import axios from 'axios'

const _axios = (config) => axios.create(config)

export default class extends ClientDecorator {

    get({headers, uri, params}) {
        return _axios({headers}).get(uri, params)
    }

    post({headers, uri, params}) {
        return _axios({headers}).post(uri, params)
    }

    patch({headers, uri, params}) {
        return _axios({headers}).patch(uri, params)
    }

    put({headers, uri, params}) {
        return _axios({headers}).put(uri, params)
    }

    delete({headers, uri, params}) {
        return _axios({headers}).delete(uri, params)
    }

}

//........... ApiHandler.js

import {RequestHandler} from '@argab/request-service'

export default class extends RequestHandler {

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

```


2.  Initialise the Request Service and connect it to your App:

```javascript
import {Request} from '@argab/request-service'
import ApiClient from './src/api/ApiClient'
import ApiHandler from './src/api/ApiHandler'

MyApp.prototype.request = new Request({
  config: {
      client: ApiClient,
      handler: ApiHandler
  }
})

new MyApp()

```

## Simple request


```javascript

import ApiHandler from './src/api/ApiHandler'
import SomeHandler from './src/api/SomeHandler'
import SomeClient from './src/api/SomeClient'

this.request
    // Configuring (optional):
    .config({ 
        handler: [SomeHandler, ApiHandler],
        client: SomeClient,
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        
        log: false  // (TRUE as a default) Use this flag to enable/disable 
                    // the request logging on the main Request instance;
                    // The requests log may be retrieved from the main instance 
                    // by calling "getLog" method (f.e: this.request.getLog())
    })
    
    // Mediators (optional):
    .unlog() // Use this flag to disable the request logging
    .headers({'Content-Type': 'application/json;charset=UTF-8'})
    .json() // Similar to .headers({'Content-Type': 'application/json;charset=UTF-8'})
    .encode() // Similar to .headers({'Content-Type': 'application/x-www-form-urlencoded'})
    .form() // Similar to .headers({'Content-Type': 'multipart/form-data'})
    .html() // Similar to .headers({'Accept': 'text/html'})
    .stream() // Similar to .headers({'Content-Type': 'application/octet-stream'})
    
    // Client Decorator (required):
    .post('http://some.url', {parameters})
    
    // Request Decorators (optional):
    .success(response => {}) // or .then(...)
    .error(response => {}) // If not called, then ApiHandler`s "onError" will be executed.
    .catch(error => {}) // If not called, then ApiHandler`s "onCatch" will be executed.
    .finally(requestData => {}) // If not called, then ApiHandler`s "onFinally" will be executed.

```


## Request Repositories And Stubs


Request repositories allow you to move the complex logic of creating requests to a separate namespace (directory)


```javascript
//............ MyApp.js

import {Request} from '@argab/request-service'
import ApiClient from './src/api/_clients/ApiClient'
import ApiHandler from './src/api/_handlers/ApiHandler'

MyApp.prototype.request = new Request({
  getRepo: (path) => {
      const Repo = require(`./api/${path}`).default
      return new Repo
  },
  getStub: (path) => {
      const Stub = require(`./api/_stubs/${path}`).default
      return new Stub
  },
  useStubs: true, 
  config: {
      client: ApiClient,
      handler: ApiHandler
  }
})

new MyApp()

//........... /api/orders.js

import {RequestRepository} from '@argab/request-service'

export default class extends RequestRepository {
    getOrders(params) {
        return this.client.get('http://some.url/orders', params)
    }
}

//........... /api/_stubs/orders.js

import {RequestRepository} from '@argab/request-service'

export default class extends RequestRepository {
    getOrders(params) {
        return this.client.stubData({SOME_STUB_DATA}).get('/orders', params)
    }
}

//.......... getOrders.js

// if "useStubs" set to true, then stubs reposiory will be connected first (only if exists).

this.request.repo('orders').getOrders({params}).then(...).error(...)

// Anyway, calling .stub() obviously will connect the stubs reposiory even if "useStubs" set to false.

this.request.stub('orders').getOrders({params}).then(...).error(...)

```


## Use of Loaders


The "Loader" meaning is a Tool that indicates a live cycle of the request. For example a Loading Spinner in the HTML Document.


```javascript
//............ MyLoader.js

import {RequestLoader} from '@argab/request-service'

class MyLoader extends RequestLoader {

    _data
    
    /*
    * @property: Displays a number of requests 
    * that uses Loader and having pending status
    * */
    pending

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


//............ MyApp.js

import {Request} from '@argab/request-service'
import ApiClient from './src/api/_clients/ApiClient'
import MyLoader from './src/api/_loaders/MyLoader'
import MyCustomLoader from './src/api/_loaders/MyCustomLoader'

MyApp.prototype.request = new Request({
  config: {
      client: ApiClient,
      loader: MyLoader,
      useLoader: true // Loaders switcher
  }
})

const app = new MyApp()

app.request
    // Loader switchers (optional):
    .config({loader: MyCustomLoader}) // Setting any custom Loader for the request
    .useLoader() // Boolean true as a default
    .bg() // Similar to .useLoader(false)
    
    .get('http://some.url').success(...).error(...).catch(...).finally(...)


```

## Extending RequestDecorator And Mediator

By Passing argument named "extend" allows to inject any custom pre-request and post-request handling methods to
the Base Request's prototype.

```javascript

//............ MyApp.js

import {Request} from '@argab/request-service'
import ApiClient from './src/api/_clients/ApiClient'
import ApiHandler from './src/api/_handlers/ApiHandler'

MyApp.prototype.request = new Request({
  config: {
      client: ApiClient,
      handler: ApiHandler
  },
  extend: {
        mediator: {
            // Be aware to declare via "function" as it allows to access to the current context by "this".
            awesome: function () {
                console.log('This is my awesome mediator function!')
                
                this.config({headers: {'X-AwesomeHeader': 'v1.0.0'}})
            }
        },
        request: {
            done: function (messageOnSuccess) {
                console.log(`This is what my ApiHandler would notify about at response success: `, messageOnSuccess)
    
                this.data.done = messageOnSuccess
            },
            alert: function (messageOnError) {
                console.log(`This is what my ApiHandler would notify about at response error: `, messageOnError)
    
                this.data.alert = messageOnError
            }
        }
  }
})

//........... ApiHandler.js

import {RequestHandler} from '@argab/request-service'

export default class extends RequestHandler {

    _data
    
    constructor(data) {
        super()
        this._data = data
    }

    isSuccess(response) {
        return true
    }

    after(response) {
        const notifySuccess = this._data.done;
        const notifyError = this._data.alert;

        if (this.isSuccess(response) && notifySuccess) {
            console.log(notifySuccess)
        } else if (this.isError(response) && notifyError) {
            console.error(notifyError)
        }
    }
}

//////////////////////////

const app = new MyApp()

app.request.awesome().get('/posts').done('Wow, that`s awesome!').alert('Ooops...')

```

Output from tests:


```
This is my awesome mediator function!
Requests in pending status:  1
Request pending:  GET /posts...
This is what my ApiHandler would notify about at response success:  Wow, that`s awesome!
This is what my ApiHandler would notify about at response error:  Ooops...
Wow, that`s awesome!
Request complete:  GET /posts.
```


