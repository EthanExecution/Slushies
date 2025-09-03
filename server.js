const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./admin.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS admin (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);
    }
});

// Seed admin credentials (only run this once)
const seedAdmin = async() => {
    const hashedPassword = await bcrypt.hash('admin123', 10); // Default password
    db.run(
        `INSERT OR IGNORE INTO admin (username, password) VALUES (?, ?)`, ['admin', hashedPassword]
    );
};
seedAdmin();

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM admin WHERE username = ?`, [username], async(err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ success: false, message: 'Internal server error' });
        } else if (!row) {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        } else {
            const isPasswordValid = await bcrypt.compare(password, row.password);
            if (isPasswordValid) {
                res.json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});