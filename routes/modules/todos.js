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
router.get('/:id/edit', (req, res) => {
   const id = req.params.id
   const userId = req.user.id
   return Todo.findOne({ where : {id, userId}})
      .then((todo) => { 
         todo = todo.toJSON()
         return res.render('edit', {todo})
      })
      .catch((err) => console.log(err))
})

router.put('/:id', (req, res) => {
   const id = req.params.id
   const userId = req.user.id
   const { name, isDone } = req.body
   return Todo.update( { name, isDone: (isDone === 'on') }, { where: {id, userId}})
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
})

// Delete
router.delete('/:id', (req, res) => {
   const id = req.params.id
   const userId = req.user.id
   return Todo.destroy({ where: {id, userId}})
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
})

module.exports = router