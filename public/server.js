const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// API для получения товаров
app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, '../data/products.json'), (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading products' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Client server running on http://localhost:${PORT}`);
});