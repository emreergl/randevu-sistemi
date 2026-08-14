const prisma = require("../config/prisma");

const getAllServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: "asc" }
        });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const getServiceById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz hizmet ID'si"});
        }

        const service = await prisma.service.findUnique({
            where: { id }
        });

        if (!service) {
            return res.status(404).json({ message: "Hizmet bulunamadı" });
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const createService = async (req, res) => {
    try {
        const { name, price, duration } = req.body;

        if (!name || price === undefined || duration === undefined) {
            return res.status(400).json({ message: "Ad, fiyat ve süre zorunludur"});
        }

        if (price <0 || duration <= 0) {
            return res.status(400).json({ message: "Fiyat negatif, süre sıfır veya negatif olamaz"});
        }

        const service = await prisma.service.create({
            data: {
                name,
                price: Number(price),
                duration: Number(duration)
            }
        });

        res.status(201).json(service);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const updateService = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, price, duration } =req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz hizmet ID'si"  });
    }

    const existing = await prisma.service.findUnique({ where: { id } });

    if (!existing) {
        return res.status(404).json({ message: "Hizmet bulunamadı" });
    }

    const service = await prisma.service.update({
        where: { id },
        data: {
            name: name ?? existing.name,
            price: price !== undefined ? Number(price) : existing.price,
            duration: duration !== undefined ? Number(duration) : existing.duration
        }
    });

    res.json(service);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const deleteService = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz hizmet id'si" });
        }

        const existing = await prisma.service.findUnique({ where: { id } });

        if (!existing) {
            return res.status(404).json({ message: "Hizmet bulunamadı" });
        }

        await prisma.service.delete({ where: { id } });

        res.json({ message: "Hizmet silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
}; 

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};