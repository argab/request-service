import {RequestRepository} from '../../dist/index.js'

export default class extends RequestRepository {
    getPosts() {
        return this.client.get('/posts')
    }
}
