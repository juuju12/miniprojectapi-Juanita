const express = require("express");
const exampleController = require("../controllers/ExampleController.js"); 
const kategoriController = require("../controllers/kategoriController.js"); 
const pelangganController = require("../controllers/pelangganController.js");
const orderController = require("../controllers/orderController.js");
const router = express.Router();

// Rute-rute untuk menu
//exampleControler sebagai menuControler
router.post('/menu/create', exampleController.create);
router.get('/menus', exampleController.getAll);
router.put('/menu/update/:id', exampleController.update);
router.delete('/menu/delete/:id', exampleController.delete);
router.get('/menu/:id',exampleController.getById)

// Rute-rute untuk kategori
router.post('/category/create', kategoriController.create);
router.get('/categories', kategoriController.getAll);
router.put('/category/update/:id', kategoriController.update);
router.delete('/category/delete/:id', kategoriController.delete);
router.get('/category/:id',kategoriController.getById)


// Rute-rute untuk pelanggan
router.post('/customer/create', pelangganController.create);
router.get('/customers', pelangganController.getAll);
router.put('/customer/update/:id', pelangganController.update);
router.delete('/customer/delete/:id', pelangganController.delete);
router.get('/customer/:id',pelangganController.getById)

// Rute-rute order
router.post('/order/create', orderController.createOrder );
router.get('/order/history', orderController.getAllOrderHistory);



module.exports = router;
