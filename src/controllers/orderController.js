const pelangganModel = require("../models/pelangganModel");
const menuModel = require("../models/menuModel");
const orderModel = require("../models/orderModel");

const orderController = {};

orderController.createOrder = (req, res) => {
    const { customerId, items } = req.body;

    pelangganModel.getByName(customerId, (err, customerData) => {
        if (!customerData) {
            return res.status(400).json({
                status: "Error",
                message: "ID Customer tidak terdaftar.",
            });
        }

        const orders = [];
        let totalOrder = 0;

        const promises = [];

        for (const item of items) {
            const { menu, price, qty } = item;

            promises.push(new Promise((resolve, reject) => {
                menuModel.getByName(menu, (err, menuData) => {
                    if (!menuData) {
                        reject("Menu tidak ditemukan: " + menu);
                    } else {
                        const order = {
                            menu: menu,
                            price: price,
                            qty: qty,
                        };
                        orders.push(order);

                        totalOrder += price * qty;

                        orderModel.addItem([{ customerId, menuId: menuData.id, qty }])
                            .then((orderData) => {
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                });
            }));
        }

        Promise.all(promises)
            .then(() => {
                const currentDate = new Date();
                const orderDate = currentDate.toISOString().split('T')[0];
                return res.json({
                    status: "OK",
                    message: "Data Berhasil Ditambahkan !",
                    orders: orders,
                    totalOrder: totalOrder,
                    orderDate: orderDate,
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    status: "Error",
                    message: "Terjadi kesalahan saat memmproses pesanan: " + error,
                });
            });
    });
};

orderController.getAllOrderHistory = (req, res) => {
    orderModel.getAllOrderHistory()
        .then((orderHistory) => {
            const formattedOrderHistory = orderHistory.map((order) => {
                const ordersWithoutTotalItemPrice = order.orders.map((item) => {
                    const { menu, price, qty } = item;
                    return { menu, price, qty };
                });

                return {
                    customerName: order.customerName,
                    orders: ordersWithoutTotalItemPrice,
                    total: order.total,
                    orderDate: order.orderDate,
                };
            });

            res.json({
                status: "OK",
                data: formattedOrderHistory
            });
        })
        .catch((error) => {
            console.error("Terjadi kesalahan saat membuat history order:", error);
            res.status(500).json({ status: "Error", message: error });
        });
};


module.exports = orderController;
