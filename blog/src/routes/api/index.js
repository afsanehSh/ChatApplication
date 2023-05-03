import express from 'express'
import admin from './admin'
import auth from './auth'
import file from './file'
import person from './person'
import message from './message'
import groupMessage from './groupMessage'

const router = express.Router()

router.use('/admin', admin)
router.use('/file', file)
router.use('/person', person)
router.use('/message', message)
router.use('/groupMessage', groupMessage)
router.use('/', auth)

export default router
