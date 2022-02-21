const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
//const mongoose = require('mongoose')
//mongoose.Promise = global.Promise

const User = require('./models/user')
const Noticia = require('./models/noticia')

const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const admin = require('./routes/admin')

const session = require('express-session')
const bodyParser = require('body-parser')

//const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({ secret: 'fullstack-master' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', auth)
app.use('/', pages)
app.use('/admin', admin)
app.use('/restrito', restrito)
app.use('/noticias', noticias)

const createInicialUser = async () => {
  const total = await User.count({})
  if(total ===0){
    const user = new User({
      username: 'rogeriogomes',
      password: '123456',
      roles: ['restrito', 'admin']
    })
   await user.save()

   const user2 = new User({
    username: 'user2',
    password: '123456',
    roles: ['restrito']
  })
 await user2.save()
   
   console.log('User Created')
  }else{
    console.log('User Created Skipped')
  } 
  /*const noticia = new Noticia ({
    title: 'Notícia Pública'+new Date().getTime(),
    content: 'content',
    category: 'public'
  })
  await noticia.save()
 
  const noticia2 = new Noticia({
    title: 'Notícia Privada'+new Date().getTime(),
    content: 'content',
    category: 'private'
  })
  await noticia2.save()*/
}

//mongoose
  //.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  //.then(() => {
    //createInicialUser()
    app.listen(port, () => console.log('Listening...'))
 // })
 // .catch(e => console.log(e))

