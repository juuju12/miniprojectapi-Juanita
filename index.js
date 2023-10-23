const express = require('express')
const router = require('./src/router')
const app = express()
const port = 3000

app.use(express.json())
app.use('/v1',router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})