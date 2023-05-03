import GroupMessage from '../models/groupMessage'
import {Op} from 'sequelize'

class GroupMessageController {
    async list(req, res) {
        const {messageId} = req.query

        const query = {
            limit: 10,
            order: [['id', 'DESC']]
        }

        if (messageId) {
            query.where = {id: {[Op.gt]: messageId}}
        }

        const message = await GroupMessage.findAll(query)

        res.json(message)
    }
}

export default new GroupMessageController()
