const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:KD9VfBqs4Bj12oyp@nasa.kpnj6xc.mongodb.net/?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
  console.log('Database MongoDB connected')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
  await mongoose.disconnect(MONGO_URL)
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}