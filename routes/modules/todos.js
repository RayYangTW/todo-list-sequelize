const express = require('express')

const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

// Create
router.get('/new', (req, res) => {
   res.render('new')
})

router.post('/', (req, res) => {
   const { name } = req.body
   const userId = req.user.id
   return Todo.create({ name, UserId: userId })
      .then(() => { return res.redirect('/') })
      .catch((err) => { console.log(err) })
})

// Read
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// Update

// Delete

module.exports = router