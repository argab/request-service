import {RequestRepository} from '../../dist/index.js'

export default class extends RequestRepository {
    getPosts() {
        return this.client.test1().get('/posts')
    }
}
