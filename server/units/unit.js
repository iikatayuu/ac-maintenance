
const express = require('express')
const database = require('../database')
const asyncWrap = require('../utils/async-wrap')
const router = express.Router()

router.get('/:id', asyncWrap(async (req, res) => {
  const unitId = req.params.id
  const query = 'SELECT `units`.*,`offices`.`name` AS `office_name` FROM `units` JOIN `offices` ON `offices`.`id`=`units`.`office_id` WHERE `units`.`id`=?'
  const units = await database.query(query, [unitId])
  res.json({
    success: true,
    message: 'No errors.',
    unit: units[0]
  })
}))

router.post('/:id', asyncWrap(async (req, res) => {
  const unitId = req.params.id
  const office = req.body.office
  const area = req.body.area
  const type = req.body.type
  const status = req.body.status
  const category = req.body.category
  const coolingCapacity = req.body.coolingCapacity || null
  const capacityRating = req.body.capacityRating || null
  const energyEfficiencyRatio = req.body.energyEfficiencyRatio || null
  const purchaseYear = req.body.purchaseYear || null
  const hoursPerDay = req.body.hoursPerDay || null
  const daysPerWeek = req.body.daysPerWeek || null

  if (!office || !area || !type || !status || !category) {
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

  const unitsResults = await database.query('SELECT * FROM `units` WHERE `id`=?', [unitId])
  if (unitsResults.length === 0) {
    res.json({
      success: false,
      mesage: 'Invalid unit ID'
    })
    return
  }

  const unit = unitsResults[0]
  const sets = []
  const values = []

  if (unit.office_id.toString() !== office) {
    sets.push('`office_id`=?')
    values.push(office)
  }

  if (unit.area !== area) {
    sets.push('`area`=?')
    values.push(area)
  }

  if (unit.type !== type) {
    sets.push('`type`=?')
    values.push(type)
  }

  if (unit.status !== status) {
    sets.push('`status`=?')
    values.push(status)
  }

  if (unit.category !== category) {
    sets.push('`category`=?')
    values.push(category)
  }

  if (unit.cooling_capacity !== coolingCapacity) {
    sets.push('`cooling_capacity`=?')
    values.push(coolingCapacity)
  }

  if (unit.capacity_rating !== capacityRating) {
    sets.push('`capacity_rating`')
    values.push(capacityRating)
  }

  if (unit.energy_efficiency_ratio !== energyEfficiencyRatio) {
    sets.push('`energy_efficiency_ratio`=?')
    values.push(energyEfficiencyRatio)
  }

  if (unit.purchase_year !== purchaseYear) {
    sets.push('`purchase_year`=?')
    values.push(purchaseYear)
  }

  if (unit.hours_per_day !== hoursPerDay) {
    sets.push('`hours_per_day`=?')
    values.push(hoursPerDay)
  }

  if (unit.days_per_week !== daysPerWeek) {
    sets.push('`days_per_week`=?')
    values.push(daysPerWeek)
  }

  if (sets.length === 0) {
    res.json({
      success: false,
      message: 'Nothing to change'
    })
    return
  }

  values.push(unitId)
  const query = 'UPDATE `units` SET ' + sets.join(', ') + ' WHERE `id`=?'
  await database.query(query, values)

  res.json({
    success: true,
    message: 'No errors.'
  })
}))

router.get('/:id/operations', asyncWrap(async (req, res) => {
  const unitId = req.params.id
  const order = req.query.order

  const orderSql = order === 'asc' ? '' : ' ORDER BY `date_end` DESC'
  const units = await database.query('SELECT `units`.*,`offices`.`name` AS `office_name` FROM `units` JOIN `offices` ON `offices`.`id`=`units`.`office_id` WHERE `units`.`id`=?', [unitId])
  if (units.length === 0) {
    res.json({
      success: false,
      message: 'Unit does not exist'
    })
    return
  }

  const unit = units[0]
  const operations = await database.query('SELECT * FROM `operations` WHERE `unit_id`=?' + orderSql, [unitId])
  const encodedOperation = {
    id: 0,
    unit_id: unitId,
    office: unit.office_name,
    area: unit.area,
    operation: 0,
    description: 'Unit was added to database.',
    date_start: unit.date_encoded,
    date_end: unit.date_encoded
  }

  res.json({
    success: true,
    message: 'No errors.',
    operations: [...operations, encodedOperation]
  })
}))

module.exports = router
