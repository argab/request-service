import {RequestRepository} from '../../dist/index.js'

export default class extends RequestRepository {
    getComments() {
        return this.client.test2().unlog().stubData({data: 'STUB COMMENTS'}).get('/comments')
    }
}
