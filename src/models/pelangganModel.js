const db = require("../../db/config")

const pelangganModel = {}
pelangganModel.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM customer', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// lanjutkan disini
pelangganModel.create = (data) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO customer (name, address, email) VALUES (?, ?, ?)`, [data.name, data.address, data.email], function (err) {
            if (err) {
                reject(err);
            } else {
                const createdMenu = {
                    name: data.name,
                    address: data.address,
                    email : data.email,
                    id: this.lastID 
                };
                resolve(createdMenu);
            }
        });
    });
};

pelangganModel.update = (id, data) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE customer SET name = ?, address = ?, email = ? WHERE id = ?',
            [data.name, data.address, data.email, id],
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

pelangganModel.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM customer WHERE id = ?',
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

pelangganModel.getByName = (customerId, callback) => {
    db.get('SELECT * FROM customer WHERE id = ?', [customerId], callback);
};

pelangganModel.findById = (id,cb) => {
    return db.get(`SELECT * FROM customer WHERE id = ${id}`,(err,row) => {
        if(err){
            cb(err,null)
        }else {
            cb(null,row)
        }
    })
}

module.exports = pelangganModel