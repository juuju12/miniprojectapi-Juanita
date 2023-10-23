const express = require("express")
const exampleController = require("../controllers/ExampleController")
const router = express.Router()

router.get('/menus',exampleController.getAll)

module.exports = router
