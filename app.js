const express = require('express')
const exphbs =require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const PORT = 3000
const app = express()

const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
   res.send('Hello')
})

// Create

// Read
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// Update

// Delete

// 登入
app.get('/users/login', (req, res) => {
   return Todo.findAll({
      raw: true,
      nest: true
   })
      .then((todos) => { return res.render('index', { todos:todos })})
      .catch((error) => { return res.status(422).json(error)})
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

// 註冊
app.get('/users/register', (req, res) => {
   res.render('register')
})

app.post('/users/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  User.findOne({ where: {email} })
   .then(user => {
      if(user) {
         console.log('User already exists')
         return res.render('register', {
            name,
            email,
            password,
            confirmPassword
         })
      }
      return bcrypt
         .genSalt(10)
         .then(salt => bcrypt.hash(password, salt))
         .then(hash => User.create({
            name,
            email,
            password
         }))
         .then(() => res.redirect('/'))
         .catch(err => console.log(err))
   })
})

// 登出
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
   console.log(`App is running on http://localhost:${PORT}`)
})