const db = require("../../db/config");

const orderModel = {};

orderModel.addItem = (orders) => {
    return new Promise((resolve, reject) => {
        // Inisialisasi variabel untuk total harga
        let totalOrder = 0;

        const insertPromises = [];

        // Mendapatkan tanggal saat ini dalam format YYYY-MM-DD
        const currentDate = new Date();
        const orderDate = currentDate.toISOString().split('T')[0];

        // Lakukan operasi penambahan item ke pesanan dalam basis data
        orders.forEach((order) => {
            const { customerId, menuId, qty } = order;

            insertPromises.push(
                new Promise((innerResolve, innerReject) => {
                    db.run(
                        `INSERT INTO orders (customer_id, menu_id, qty, order_date) VALUES (?, ?, ?, ?)`,
                        [customerId, menuId, qty, orderDate],
                        function (err) {
                            if (err) {
                                innerReject(err);
                            } else {
                                innerResolve({ id: this.lastID, menuId, qty });
                            }
                        }
                    );
                }
            ));

            totalOrder += order.price * qty;
        });

        Promise.all(insertPromises)
            .then((addedOrders) => {
                resolve({ orders: addedOrders, totalOrder, orderDate });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

orderModel.getAllOrderHistory = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                customer.id AS customerId,
                customer.name AS customerName,
                DATE(order_date) AS orderDate,
                menu.item AS menu,
                menu.price,
                orders.qty
            FROM orders
            JOIN customer ON orders.customer_id = customer.id
            JOIN menu ON orders.menu_id = menu.id
            ORDER BY customerId, orderDate;
        `;

        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const orderHistory = [];
                let currentCustomer = null; 
                let currentOrder = null; 

                rows.forEach(row => {
                    const { customerId, customerName, orderDate, menu, price, qty } = row;

                    if (currentCustomer !== customerId || currentOrder !== orderDate) {
                        currentCustomer = customerId;
                        currentOrder = orderDate;
                        orderHistory.push({
                            customerName,
                            orderDate,
                            orders: [],
                            total: 0, 
                        });
                    }

                    const totalItemPrice = price * qty;
                    orderHistory[orderHistory.length - 1].orders.push({ menu, price, qty, totalItemPrice });
                    
                    orderHistory[orderHistory.length - 1].total += totalItemPrice;
                });

                resolve(orderHistory);
            }
        });
    });
};

module.exports = orderModel;
