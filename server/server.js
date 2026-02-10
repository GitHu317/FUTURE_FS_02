const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION (AIVEN + Render SAFE) ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection & auto-create table
db.query('SELECT 1', (err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err);
        return;
    }

    console.log('✅ Connected to Aiven MySQL');

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        source VARCHAR(50) DEFAULT 'Website',
        status ENUM('New', 'Contacted', 'Converted') DEFAULT 'New',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    db.query(createTableQuery, (err) => {
        if (err) console.error('❌ Error creating table:', err);
        else console.log("✅ Table 'leads' verified/created");
    });
});

// --- API ROUTES ---

// 1. SECURE LOGIN
app.post('/api/login', (req, res) => {
    const { password } = req.body;

    if (!process.env.ADMIN_PASSWORD) {
        return res.status(500).json({ success: false, message: 'Admin password not set in environment variables.' });
    }

    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// 2. GET: Fetch all leads
app.get('/api/leads', (req, res) => {
    db.query('SELECT * FROM leads ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Error fetching leads:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// 3. POST: Create a new lead
app.post('/api/leads', (req, res) => {
    const { name, email, message } = req.body;
    const sql = `
        INSERT INTO leads (name, email, notes, status, source)
        VALUES (?, ?, ?, 'New', 'Website')
    `;
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error creating lead:', err);
            return res.status(500).json(err);
        }
        res.status(201).json({ message: 'Lead created successfully', id: result.insertId });
    });
});

// 4. PUT: Update lead status & notes
app.put('/api/leads/:id', (req, res) => {
    const { status, notes } = req.body;
    db.query(
        'UPDATE leads SET status = ?, notes = ? WHERE id = ?',
        [status, notes, req.params.id],
        (err) => {
            if (err) {
                console.error('Error updating lead:', err);
                return res.status(500).json(err);
            }
            res.json({ message: 'Lead updated successfully' });
        }
    );
});

// 5. DELETE: Remove a lead
app.delete('/api/leads/:id', (req, res) => {
    db.query('DELETE FROM leads WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting lead:', err);
            return res.status(500).json(err);
        }
        res.json({ message: 'Lead deleted successfully' });
    });
});

// --- START SERVER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 CRM Server running on port ${PORT}`);
});
