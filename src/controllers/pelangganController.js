const pelangganModel = require("../models/pelangganModel")

const pelangganController = {}


pelangganController.getAll = async (req, res) => {
    try {
        const pelangganData = await pelangganModel.getAll();
        res.status(200).json({
            status: "OK",
            data: pelangganData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat memuat pelanggan.',
            error: error.message
        });
    }
};


// silahkan buat varian controller lain sesuai fitur masing masing
pelangganController.create = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                status: 'Error',
                message: 'Nama dan email harus diisi.'
            });
        }

        const validName = /^[A-Za-z\s]+$/;
        const validEmail = /^[A-Za-z@.]+$/;

        if (!validName.test(name)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Nama hanya berupa huruf dan spasi.'
            });
        }

        if (!validEmail.test(email)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid email format. Email hanya diperbolehkan huruf dan . serta @).'
            });
        }

        const newPelanggan = await pelangganModel.create(req.body);
        res.status(201).json({
            status: "OK",
            message: "Data Berhasil Ditambahkan",
            data: {
                name: req.body.name,
                email: req.body.email,
                id: newPelanggan.id 
            }
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan saat input customer',
            error: error.message
        });
    }
};

pelangganController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const { name, email } = updatedData;

        if (!name || !email) {
            return res.status(400).json({
                status: 'Error',
                message: 'Nama dan email harus diisi.'
            });
        }

        const validName = /^[A-Za-z\s]+$/;
        const validEmail = /^[A-Za-z@.]+$/;


        if (!validName.test(name)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Nama hanya berupa huruf dan spasi.'
            });
        }

        if (!validEmail.test(email)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Invalid email format. Email hanya berupa huruf dan . serta @.'
            });
        }

        const success = await pelangganModel.update(id, updatedData);

        if (success) {
            res.status(200).json({
                status: 'OK',
                message: 'Berhasil memperbarui data.',
                data: updatedData
            });
        } else {
            res.status(404).json({
                status: 'Error',
                message: 'Data tidak ditemukan.'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan saat memperbarui data.',
            error: error.message
        });
    }
};

pelangganController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await pelangganModel.delete(id);

        if (success) {
            res.status(200).json({
                message: 'Data berhasil dihapus.'
            });
        } else {
            res.status(404).json({
                message: 'Customer tidak ditemukan.'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus data',
            error: error.message
        });
    }
};

pelangganController.getById = (req, res) => {
    const { id } = req.params;

    pelangganModel.findById(id, (err, rows) => {
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


module.exports = pelangganController