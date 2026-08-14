const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const jwt = require("jsonwebtoken");

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

const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN } 
    );
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'E-posta ve şifre zorunludur'});
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({message: 'Geçersiz e-posta veya şifre girdiniz'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({message: 'Geçersiz e-posta veya şifre girdiniz'});
        }

        const token = generateToken(user);
        res.json({
            token,
            user: {
                id:user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.user.userId},
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası"});
    }
    };
module.exports = { register, login, getMe };