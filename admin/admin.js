const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;
const productsPath = path.join(__dirname, '../data/products.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Получение всех товаров
app.get('/api/products', (req, res) => {
    fs.readFile(productsPath, (err, data) => {
        if (err) return res.status(500).send('Error reading products');
        res.json(JSON.parse(data));
    });
});

// Добавление товара
app.post('/api/products', (req, res) => {
    fs.readFile(productsPath, (err, data) => {
        if (err) return res.status(500).send('Error reading products');
        
        const products = JSON.parse(data);
        const newProduct = {
            id: Date.now().toString(),
            ...req.body
        };
        products.push(newProduct);
        
        fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving product');
            res.status(201).json(newProduct);
        });
    });
});

// Обновление товара
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    
    fs.readFile(productsPath, (err, data) => {
        if (err) return res.status(500).send('Error reading products');
        
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }
        
        products[productIndex] = { ...products[productIndex], ...req.body };
        
        fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).send('Error updating product');
            res.json(products[productIndex]);
        });
    });
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    
    fs.readFile(productsPath, (err, data) => {
        if (err) return res.status(500).send('Error reading products');
        
        let products = JSON.parse(data);
        products = products.filter(p => p.id !== productId);
        
        fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).send('Error deleting product');
            res.sendStatus(204);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Admin server running on http://localhost:${PORT}`);
});