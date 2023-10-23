const kategoriModel = require("../models/kategoriModel")

const kategoriController={}

kategoriController.getAll = async (req, res) => {
    try {
        const kategoriData = await kategoriModel.getAll();
        res.status(200).json({
            status: "OK",
            data: kategoriData
        });
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan saat memuat kategori",
            error: error.message
        });
    }
};

kategoriController.create = async (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== 'string' || name.trim().length === 0 || !/^[a-zA-Z\s]*$/.test(name)) {
            return res.status(400).json({
                status: "Error",
                message: "Nama kategori harus berupa string yang tidak kosong dan berupa Huruf serta spasi."
            });
        }

        const newKategori = await kategoriModel.create(req.body);
        res.status(201).json({
            status: "OK",
            message: "Data Berhasil Ditambahkan.",
            data: {
                name: name,
                id: newKategori.id
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Terjadi kesalahan saat membuat kategori.",
            error: error.message
        });
    }
};

kategoriController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!updatedData.name || typeof updatedData.name !== 'string' || updatedData.name.trim().length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "Nama kategori harus berupa string yang tidak kosong."
            });
        }

        const validCategoryName = /^[a-zA-Z\s]*$/;
        if (!validCategoryName.test(updatedData.name)) {
            return res.status(400).json({
                status: "Error",
                message: "Nama kategori berisi huruf dan spasi."
            });
        }

        const success = await kategoriModel.update(id, updatedData);

        if (success) {
            res.status(200).json({
                status: "OK",
                message: "Data Berhasil Diperbarui.",
                data: updatedData
            });
        } else {
            res.status(404).json({
                status: "Error",
                message: "Data tidak ditemukan."
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Terjadi kesalahan saat update data.",
            error: error.message
        });
    }
};


kategoriController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await kategoriModel.delete(id);

        if (success) {
            res.status(200).json({
                message: "Data berhasil dihapus."
            });
        } else {
            res.status(404).json({
                message: "Kategori tidak ditemukan."
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan saat menghapus data.",
            error: error.message
        });
    }
};

kategoriController.getById = (req, res) => {
    const { id } = req.params;

    kategoriModel.findById(id, (err, rows) => {
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
                    message: "Data tidak ditemukan"
                });
            }
        }
    });
}


module.exports = kategoriController