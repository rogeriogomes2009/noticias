const express = require('express')
const router = express.Router()
const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

router.use(passport.initialize())  
router.use(passport.session())

passport.serializeUser((user, done) => {
  done (null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

//definindo estrategia para login local
passport.use(new LocalStrategy(async(username, password, done) => {
  const user = await User.findOne({ username })
  if(user){
    const isValid = await user.checkPassword(password)
    if(isValid){
      return done(null, user)
    }else{
      return done(null, false)
    }
  }else{
      return done (null, false)
  }
}))

//Estrategia de acesso com Facebook

passport.use(new FacebookStrategy({
  clientID: '738040873746708',
  clientSecret: 'b0882412fd109d43234a94e41730006a',
  callbackURL: 'https://noticias-nine.vercel.app/facebook/callback',
  profileFilds: ['id', 'displayName', 'email', 'photos']
}, async(accessToken, refreshToken, profile, done) => {
  const userDB = await User.findOne({ facebookId: profile.id })
  if(!userDB){
    const user = new User({
      name: profile.displayName,
      facebookId: profile.id,
      roles: ['restrito']
    })
    await user.save()
    done(null, user)
  }else{
    done(null, userDB)
  }
}))

//definindo estratégia com o Google

passport.use( new GoogleStrategy ({
  clientID: '1097781024630-mm3ps82ms2ra9dmd48ber7srvr3iqtj1.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://noticias-nine.vercel.app/google/callback',
  }, async(accessToken, refreshToken, err, profile, done) => {
  const userDB = await User.findOne({ googleId: profile.id })
  if(!userDB){
    const user = new User({
      name: profile.displayName,
      googleId: profile.id,
      roles: ['restrito']
    })
    await user.save()
    done(null, user)
  }else{
    done(null, userDB)
  }

}))

router.use((req, res, next) => {
  if(req.isAuthenticated()){
    res.locals.user = req.user
    if(!req.session.role){
      req.session.role = req.user.roles[0]
    }
    res.locals.role = req.session.role
  }
  next()
})

router.get('/change-role/:role', (req, res) => {
  if(req.isAuthenticated()){
  if(req.user.roles.indexOf(req.params.role)>=0){
    req.session.role = req.params.role
  }}
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', 
            passport.authenticate('facebook', { failureRedirect: '/'}),
            (req, res) => {
              res.redirect('/')
            }
)

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile']}))
router.get('/google/callback', 
            passport.authenticate('google', { failureRedirect: '/', successRedirect: '/'}),
)

module.exports = router