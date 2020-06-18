require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')



const TWO_HOURS = 1000 * 60 * 60 * 2


const IN_PROD = process.env.NODE_ENV === 'production'

app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SES_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        samSite: true,
        secure: IN_PROD
    }
}))


// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true, useCreateIndex: true   })

mongoose.connect(process.env.DATABASE_URL_ATLAS, { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true, useCreateIndex: true  })



const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected to Database'))

app.use(cors({ credentials: true, origin: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

// authorization - adgang til admin

app.use('*admin*', (req, res, next) => {

    if (!req.session.userId) {
        // return res.status(401).json({message: 'Du har ikke adgang'})
    }

    next()
})

const hundeRouter = require('./routes/hunde.routes')
app.use('/hunde', hundeRouter)

const brugerRouter = require('./routes/bruger.routes')
app.use('/bruger/admin', brugerRouter)

const authRouter = require('./routes/auth.routes')
app.use('/auth', authRouter)

app.listen(process.env.PORT, () => console.log('Server køre på ' + process.env.PORT))