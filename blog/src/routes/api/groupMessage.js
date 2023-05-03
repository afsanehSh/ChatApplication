import express from 'express'
import GroupMessageController from '../../controllers/groupMessage'
import acl from '../../middlewares/acl'

const router = express.Router()

router.get('/', acl('USER'), GroupMessageController.list)

export default router
