
const express = require('express')
const database = require('../database')
const asyncWrap = require('../utils/async-wrap')
const router = express.Router()

router.get('/', asyncWrap(async (req, res) => {
  const offices = await database.query('SELECT * FROM `offices`')
  res.json({
    success: true,
    message: 'No errors.',
    offices
  })
}))

module.exports = router
