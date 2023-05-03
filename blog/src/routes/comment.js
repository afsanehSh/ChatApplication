import express from 'express'
import ArticleController from '../controllers/article'

const router = express.Router()

router.post('/createComment', ArticleController.createComment)
router.get('/createComment/:articleId', ArticleController.show)

export default router
