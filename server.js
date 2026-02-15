const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            description TEXT
        )`);

        // Buyers table
        db.run(`CREATE TABLE IF NOT EXISTS buyers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            address TEXT
        )`);
    });
}

// Routes

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// Products routes
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.render('products', { products: rows });
    });
});

app.get('/products/add', (req, res) => {
    res.render('add-product');
});

app.post('/products/add', (req, res) => {
    const { name, category, price, quantity, description } = req.body;

    // Basic validation
    if (!name || !category || !price || !quantity) {
        return res.render('add-product', { error: 'All required fields must be filled' });
    }

    if (isNaN(price) || price <= 0) {
        return res.render('add-product', { error: 'Price must be a positive number' });
    }

    if (isNaN(quantity) || quantity < 0) {
        return res.render('add-product', { error: 'Quantity must be a non-negative number' });
    }

    db.run(`INSERT INTO products (name, category, price, quantity, description) VALUES (?, ?, ?, ?, ?)`,
        [name, category, parseFloat(price), parseInt(quantity), description],
        function(err) {
            if (err) {
                return res.render('add-product', { error: 'Error adding product: ' + err.message });
            }
            res.redirect('/products');
        });
});

app.post('/products/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/products');
    });
});

// Buyers routes
app.get('/buyers', (req, res) => {
    db.all('SELECT * FROM buyers', [], (err, rows) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.render('buyers', { buyers: rows });
    });
});

app.get('/buyers/add', (req, res) => {
    res.render('add-buyer');
});

app.post('/buyers/add', (req, res) => {
    const { name, email, phone, address } = req.body;

    // Basic validation
    if (!name || !email || !phone) {
        return res.render('add-buyer', { error: 'All required fields must be filled' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('add-buyer', { error: 'Please enter a valid email address' });
    }

    db.run(`INSERT INTO buyers (name, email, phone, address) VALUES (?, ?, ?, ?)`,
        [name, email, phone, address],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.render('add-buyer', { error: 'Email already exists' });
                }
                return res.render('add-buyer', { error: 'Error adding buyer: ' + err.message });
            }
            res.redirect('/buyers');
        });
});

app.post('/buyers/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM buyers WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).send('Error deleting buyer');
        }
        res.redirect('/buyers');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});