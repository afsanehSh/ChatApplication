import '../src/config/loadTestEnv'
import supertest from 'supertest'
import {bootstrap} from '../src/app'
import {redisClient} from '../src/config/redis'
import {logger, mongoTransport} from '../src/utils/logger'
import User from '../src/models/user'
import Comment from '../src/models/comment'
import {Op} from 'sequelize'
import Article from "../src/models/article";

let request, user, comment, article

const fakeUser = {
    username: 'afsaneh',
    email: 'afsaneh@yahoo.com',
    password: '123'
}

const fakeComment = {
    text: 'comment text',
    articleId: 1
}


beforeAll(async () => {
    const server = await bootstrap()
    request = supertest(server)

    await request.post('/register').send(fakeUser)

    const response = await request
        .post('/api/login')
        .send({username: fakeUser.username, password: fakeUser.password})

    user = response.body

    await User.update(
        {role: 'ADMIN'},
        {where: {username: fakeUser.username}}
    )

    const fakeArticle = new Article({title: "fake article title", text: "fake article text", userId: user.id})
    article = await fakeArticle.save()

})

afterAll(async () => {
    await User.destroy({where: {username: fakeUser.username}})

    await Comment.destroy({where: {id: {[Op.gt]: 0}}})
    await Article.destroy({where: {id: {[Op.gt]: 0}}})

    await redisClient.disconnect()

    logger.clear()
    logger.remove(mongoTransport)
})

describe('Comment Api', () => {
    test('list comment 200', async () => {
        const response = await request
            .get(`/comment/createComment/${article.id}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(response.statusCode).toBe(200)
    })

    test('create comment', async () => {

        fakeComment.articleId = article.id

        const response = await request
            .post('/comment/createComment')
            .set('Authorization', `Bearer ${user.token}`)
            .send(fakeComment)

        comment = response.body

        expect(response.statusCode).toBe(302)

        const comments = await Comment.findAll({where: {articleId: article.id}})

        expect(comments.length).toBe(1)

        checkComment(comments[0])
    })

    function checkComment(comment) {
        expect(comment.text).toBe(fakeComment.text)
        expect(comment.articleId).toBe(fakeComment.articleId)
        expect(comment).toHaveProperty('id')
    }
})
