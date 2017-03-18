require('dotenv').config()

const morgan = require('morgan')
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient // directly retrieves data from Mongo DB
const port = process.env.PORT || 3000
// const router = express.Router()
// const io = require('socket.io').listen(port);

const http = require('http').createServer(app)
const io = require('socket.io')(http)  // to update client js with new data

// const requestify = require('requestify') --> for optimisation, wdditv2 needs to have a change log item.
// have a pre-save hook such that item ids are logged.
// when dashboard queries the API url, change log object returned and then dashboard will query for the relevant ids
// this is the alternative to mongo oplog which will require watchers

const path = require('path')


let usersData = []
let postsData = []
let repliesData = []
let guestInteractionData = []
let userInteractionData = []
let db = null

/* establish connection with db once server loads. polls data every 10 secs */
MongoClient.connect(process.env.MONGO_URI, function (err, newConnection) {
  if (err) {
    throw err
  } else {
    db = newConnection
    pollServer()
    setInterval(pollServer, 10000)
  }
})

function pollServer () {

  db.collection('userinteractions').find({}, function (err, cb) {
    if (err) return console.log('smth went wrong')
    cb.toArray(function (err, results) {
      // console.log('results is in data type of ', results);
      userInteractionData = results
      io.emit('userInteractionUpdate', userInteractionData)
    })
  })

  db.collection('guestinteractions').find({}, function (err, cb) {
    if (err) return console.log('smth went wrong')
    cb.toArray(function (err, results) {
      guestInteractionData = results
      console.log('guest interactions data ', results);
      io.emit('guestInteractionUpdate', guestInteractionData)
    })
  })

  db.collection('users').find({}, function (err, cb) {
    if (err) return console.log('smth went wrong')
    cb.toArray(function (err, results) {
      usersData = results
      console.log('users ', results)
      io.emit('usersUpdate', usersData)
    })
  })

  db.collection('posts').find({}, function (err, cb) {
    if (err) return console.log('smth went wrong')
    cb.toArray(function (err, results) {
      postsData = results
      // console.log('in cb ', results)
      io.emit('postsUpdate', postsData)
    })
  })

  db.collection('replies').find({}, function (err, cb) {
    if (err) return console.log('smth went wrong')
    cb.toArray(function (err, results) {
      repliesData = results
      io.emit('repliesUpdate', repliesData)
    })
  })
}

app.use(express.static(path.join(__dirname, '/public')))
app.use(morgan('dev'))

app.get('/useractivity', function (req, res) {
  res.sendFile('userActivity.html', {root: path.join(__dirname, '/public')})
})

// removed due to errors
// app.get('/userbehaviour', function (req, res) {
//   res.sendFile('userBehaviour.html', {root: path.join(__dirname, '/public')})
// })

app.get('/guestsconversions', function (req, res) {
  res.sendFile('guestsconversions.html', {root: path.join(__dirname, '/public')})
})

http.listen(port)

console.log('Server started on ' + port)
