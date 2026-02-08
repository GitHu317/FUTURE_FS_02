const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

// --- API ROUTES ---

// 1. SECURE LOGIN: Verify password on the server
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// 2. GET: Fetch all leads
app.get('/api/leads', (req, res) => {
    const sql = 'SELECT * FROM leads ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
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
    // Maps form 'message' to DB 'notes'
    const sql = 'INSERT INTO leads (name, email, notes, status, source) VALUES (?, ?, ?, "New", "Website")';
    
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error creating lead:', err);
            return res.status(500).json(err);
        }
        res.status(201).json({ message: 'Lead created successfully', id: result.insertId });
    });
});

// 4. PUT: Update lead status AND notes
app.put('/api/leads/:id', (req, res) => {
    const { status, notes } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE leads SET status = ?, notes = ? WHERE id = ?';
    
    db.query(sql, [status, notes, id], (err, result) => {
        if (err) {
            console.error('Error updating lead:', err);
            return res.status(500).json(err);
        }
        res.json({ message: 'Lead updated successfully' });
    });
});

// 5. DELETE: Remove a lead
app.delete('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM leads WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting lead:', err);
            return res.status(500).json(err);
        }
        res.json({ message: 'Lead deleted successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 CRM Server running on port ${PORT}`);
});