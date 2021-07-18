# Request Service

Provides a fully customizable Library for handling API using Request repositories and Stubs.

## Initialization

1. Create your own Request client ES-6 class extending "ClientDecorator" from the package.

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

import {RequestHandler} from "@argab/request-service"

export default class extends RequestHandler {

    isSuccess(response) {
    }
    
    isError(response) {
    }
    
    onSuccess(response) {
    }
    
    onError(response) {
    }
    
    onCatch(error) {
    }
    
    onFinally(requestData) {
    }
    
    before(requestData) {
    }
    
    after(response) {
    }
}

```


2.  Initialize the Request Service and connect it to your App:

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
    // configurating (optional):
    .config({ 
        handler: [SomeHandler, ApiHandler],
        client: SomeClient,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
    })
    
    // mediators (optional):
    .headers({'Content-Type': 'application/json;charset=UTF-8'})
    .json() // Similar to .headers({'Content-Type': 'application/json;charset=UTF-8'})
    .encode() // Similar to .headers({'Content-Type': 'application/x-www-form-urlencoded'})
    .form() // Similar to .headers({'Content-Type': 'multipart/form-data'})
    .html() // Similar to .headers({'Accept': 'text/html'})
    
    // client decorator (required):
    .post('http://some.url', {parameters}, {optionalConfig})
    
    // request decorators (optional):
    .success(response => {}) // or .then(...)
    .error(response => {}) // If not called, then ApiHandler`s "onError" will be executed.
    .catch(error => {}) // If not called, then ApiHandler`s "onCatch" will be executed.
    .finally(requestData => {}) // If not called, then ApiHandler`s "onFinally" will be executed.

    // get a new Promise.prototype;
    // as a result we get the request`s statusCode here
    .await()

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
    * @property: Number: Displays a number of requests that uses Loader and having pending status
    * */
    pending

    constructor(data) {
        super()
        this._data = data
    }

    start() {
        console.log('Requests in pending status: ', this.pending)
        console.log('Pending the request: ', `${this._data.method.toUpperCase()} ${this._data.uri}...`)
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
