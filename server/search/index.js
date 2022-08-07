
const express = require('express')
const database = require('../database')
const asyncWrap = require('../utils/async-wrap')
const router = express.Router()

router.get('/', asyncWrap(async (req, res) => {
  const office = req.query.office
  const area = req.query.area
  const type = req.query.type
  const status = req.query.status
  const category = req.query.category

  const conditions = []
  const values = []
  if (office) {
    conditions.push('`office_id`=?')
    values.push(office)
  }

  if (area) {
    conditions.push('`area` LIKE ?')
    values.push(`%${area}%`)
  }

  if (type) {
    conditions.push('`type`=?')
    values.push(type)
  }

  if (status) {
    conditions.push('`status`=?')
    values.push(status)
  }

  if (category) {
    conditions.push('`category`=?')
    values.push(category)
  }

  const baseQuery = 'SELECT `units`.*,`offices`.`name` AS `office_name` FROM `units` JOIN `offices` ON `offices`.`id`=`units`.`office_id`'
  const query = baseQuery + (conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '')
  try {
    const results = await database.query(query, values)
    res.json({
      success: true,
      message: 'No errors.',
      results
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      results: null
    })
  }
}))

module.exports = router
