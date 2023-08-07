import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = process.env.PORT

// Koneksi ke MongoDB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Terhubung ke database MongoDB');
    })
    .catch((error) => {
        console.error('Koneksi ke database gagal:', error);
    });

// model user
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)

// middleware 
app.use(bodyParser.json())

// Endpoint untuk registrasi pengguna
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Periksa apakah pengguna sudah terdaftar
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username sudah terdaftar' });
        }

        // Enkripsi password pengguna
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna baru
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Endpoint untuk login pengguna
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Periksa apakah pengguna ada dalam database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Periksa kecocokan password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Buat token access
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        // Buat token refresh
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);

        return res.json({ accessToken, refreshToken });
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Endpoint untuk refresh token
app.post('/api/refresh', (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Periksa validitas refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Refresh token tidak valid' });
            }

            // Buat token access baru
            const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            });

            return res.json({ accessToken });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// Middleware untuk verifikasi token access
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token access tidak tersedia' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token access tidak valid' });
        }

        req.userId = decoded.userId;
        next();
    });
}

// Contoh penggunaan middleware authenticateToken
app.get('/api/protected', authenticateToken, (req, res) => {
    return res.json({ message: 'Ini adalah konten yang dilindungi' });
});



app.listen(port, () => {
    console.log(`server running on port ${port}`)
})