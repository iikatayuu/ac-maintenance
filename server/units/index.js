
const express = require('express')
const database = require('../database')
const asyncWrap = require('../utils/async-wrap')
const unit = require('./unit')
const router = express.Router()

router.use('/unit', unit)

router.get('/', asyncWrap(async (req, res) => {
  const units = await database.query('SELECT * FROM `units`')
  res.json({
    success: true,
    message: 'No errors.',
    units
  })
}))

router.get('/filters', asyncWrap(async (req, res) => {
  const types = await database.query('SELECT DISTINCT `type` FROM `units`')
  const statuses = await database.query('SELECT DISTINCT `status` FROM `units`')
  const categories = await database.query('SELECT DISTINCT `category` FROM `units`')

  res.json({
    success: true,
    message: 'No errors.',
    types: types.map(res => res.type.toUpperCase()),
    statuses: statuses.map(res => res.status.toUpperCase()),
    categories: categories.map(res => res.category.toUpperCase())
  })
}))

router.post('/', asyncWrap(async (req, res) => {
  const office = req.body.office
  const area = req.body.area
  const type = req.body.type
  const status = req.body.status
  const category = req.body.category
  const quantity = req.body.quantity
  const coolingCapacity = req.body.coolingCapacity || null
  const capacityRating = req.body.capacityRating || null
  const energyEfficiencyRatio = req.body.energyEfficiencyRatio || null
  const purchaseYear = req.body.purchaseYear || null
  const hoursPerDay = req.body.hoursPerDay || null
  const daysPerWeek = req.body.daysPerWeek || null

  if (!office || !area || !type || !status || !category || !quantity) {
    res.json({
      success: false,
      message: 'Invalid parameters'
    })
    return
  }

  const officeResults = await database.query('SELECT * FROM `offices` WHERE `id`=?', [office])
  if (officeResults.length === 0) {
    res.json({
      success: false,
      message: 'Invalid office ID'
    })
    return
  }

  const cols = [
    'office_id', 'area', 'type', 'status', 'category', 'cooling_capacity', 'capacity_rating',
    'energy_efficiency_ratio', 'purchase_year', 'hours_per_day', 'days_per_week'
  ]

  const colsStr = cols.map(col => `\`${col}\``).join(', ')
  const inserts = []
  const insert = (new Array(cols.length)).fill('?', 0, cols.length).join(', ')
  const inputs = []
  const input = [
    office, area, type, status, category, coolingCapacity, capacityRating, energyEfficiencyRatio,
    purchaseYear, hoursPerDay, daysPerWeek
  ]

  for (let i = 0; i < quantity; i++) {
    inserts.push('(' + insert + ')')
    inputs.push(...input)
  }

  const query = 'INSERT INTO `units` (' + colsStr + ') VALUES ' + inserts.join(', ')
  await database.query(query, inputs)

  res.json({
    success: true,
    message: 'No errors.'
  })
}))

module.exports = router
