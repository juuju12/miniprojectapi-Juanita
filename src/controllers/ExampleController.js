const menuModel = require("../models/menuModel")

const exampleController = {}


exampleController.getAll = async (req, res) => {
    try {
        const menuData = await menuModel.getAll();
        res.status(200).json({
            status: "OK",
            data: menuData
        });
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan saat memuat menu.",
            error: error.message
        });
    }
};


// silahkan buat varian controller lain sesuai fitur masing masing
exampleController.create = async (req, res) => {
    try {
        const { item, price } = req.body;

        if (!item || !price) {
            return res.status(400).json({
                status: "Error",
                message: "Item dan Price harus diisi."
            });
        }

        if (typeof item !== 'string' || item.trim().length === 0) {
            return res.status(400).json({
                status: "Error",
                message: 'Item harus berupa string yang tidak kosong.'
            });
        }
        
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                status: 'Error',
                message: 'Price harus berupa angka positif.'
            });
        }

        const validItemName = /^[a-zA-Z\s]*$/;
        if (!validItemName.test(item)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Item hanya berisi huruf dan spasi.'
            });
        }

        const newMenu = await menuModel.create({ item, price });
        const id = newMenu.id;
        const response = {
            status: "OK",
            message: "Data Berhasil Ditambahkan.",
            data: {
                menu: item,
                price: price,
                id: id
            }
        };

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan saat input menu',
            error: error.message
        });
    }
};



exampleController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { item, price } = req.body;

        if (typeof item !== 'string' || item.trim().length === 0) {
            return res.status(400).json({
                status: 'Error',
                message: 'Item harus berupa string yang tidak kosong.'
            });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                status: 'Error',
                message: 'Price harus berupa angka positif.'
            });
        }

        const success = await menuModel.update(id, { item, price });

        if (success) {
            res.status(200).json({
                status: 'OK',
                message: 'Data berhasil diperbarui',
                data: { item, price } // data diperbarui
            });
        } else {
            res.status(404).json({
                status: 'Error',
                message: 'Data tidak ditemukan'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan saat update data.',
            error: error.message
        });
    }
};



exampleController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await menuModel.delete(id);

        if (success) {
            res.status(200).json({
                message: 'Data berhasil dihapus.'
            });
        } else {
            res.status(404).json({
                message: 'Menu tidak ditemukan.'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus data.',
            error: error.message
        });
    }
};

exampleController.getById = (req, res) => {
    const { id } = req.params;

    menuModel.findById(id, (err, rows) => {
        if (err) {
            res.status(500).json({
                message: "Error",
                error: err.message
            });
        } else {
            if (rows) {
                res.json({
                    message: "OK",
                    data: rows
                });
            } else {
                res.status(404).json({
                    message: "Data tidak ditemukan."
                });
            }
        }
    });
}

module.exports = exampleController;