import {RequestRepository} from '../../dist/index.js'

export default class extends RequestRepository {
    getPosts() {
        return this.client.stubData({data: [0, 1, 2, 3, 4]}).get('/posts')
    }
}
