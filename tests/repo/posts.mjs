import {RequestRepository} from '../../dist/index.js'

export default class extends RequestRepository {
    getPosts(arg1, arg2, arg3, arg4, arg5) {
        console.log({arg1, arg2, arg3, arg4, arg5})
        return this.client.get('/posts')
    }
}
