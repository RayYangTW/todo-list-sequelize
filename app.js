const express = require('express')
const session = require('express-session')
const exphbs =require('express-handlebars')
const methodOverride = require('method-override')

const PORT = 3000
const app = express()

const routes = require('./routes')

const usePassport = require('./config/passport')

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use(session({
   secret:'ThisIsMySecret',
   resave: false,
   saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

app.use(routes)

app.listen(PORT, () => {
   console.log(`App is running on http://localhost:${PORT}`)
})