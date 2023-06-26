const mongoose = require('mongoose')



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