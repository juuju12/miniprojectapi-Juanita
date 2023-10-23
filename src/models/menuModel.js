const db = require("../../db/config")

const menuModel = {}
menuModel.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM menu', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// lanjutkan disini
menuModel.create = (data) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO menu (item, price) VALUES (?, ?)`, [data.item, data.price], function (err) {
            if (err) {
                reject(err);
            } else {
                const createdMenu = {
                    item: data.item,
                    price: data.price,
                    id: this.lastID 
                };
                resolve(createdMenu);
            }
        });
    });
};

menuModel.update = (id, data) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE menu SET item = ?, price = ? WHERE id = ?',
            [data.item, data.price, id],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0); 
                }
            }
        );
    });
};

menuModel.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM menu WHERE id = ?',
            [id],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes > 0) {
                        resolve(true); 
                    } else {
                        resolve(false); 
                    }
                }
            }
        );
    });
};

menuModel.getByName = (itemName, callback) => {
    db.get('SELECT * FROM menu WHERE item = ?', [itemName], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

menuModel.findById = (id,cb) => {
    return db.get(`SELECT * FROM menu WHERE id = ${id}`,(err,row) => {
        if(err){
            cb(err,null)
        }else {
            cb(null,row)
        }
    })
}

module.exports = menuModel