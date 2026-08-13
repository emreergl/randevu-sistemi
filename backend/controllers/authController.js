const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Ad, e-posta ve şifre gereklidir' });
        }
    

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone
            }
        });

       res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
       });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = { register };