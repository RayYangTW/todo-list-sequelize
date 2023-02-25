const express = require('express')
const passport = require('passport')

const router = express.Router()

const db = require('../../models')
const User = db.User

// 登入
router.get('/login', (req, res) => {
   res.render('login')
})

router.post('/login', passport.authenticate('local', {
   successRedirect:'/',
   failureRedirect:'/users/login'
}))

// 註冊
router.get('/register', (req, res) => {
   res.render('register')
})

router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  let errors = []
  if ( !name || !email || !password || !confirmPassword ) {
   errors.push({ message: 'All fields are required.' })
  }
  if (password !== confirmPassword) {
   errors.push({ message: 'Password and Confirm Password are not matched.'})
  }
  if (errors.length) {
   return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
   })
  }
  User.findOne({ where: {email} })
   .then(user => {
      if(user) {
         errors.push({ message: 'User already exists.' })
         return res.render('register', {
            errors,
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
            password: hash
         }))
         .then(() => res.redirect('/'))
         .catch(err => console.log(err))
   })
})

// 登出
router.get('/logout', (req, res) => {
   req.logout()
   req.flash('success_msg', 'logout successfully.')
   res.redirect('/users/login')
})

module.exports = router