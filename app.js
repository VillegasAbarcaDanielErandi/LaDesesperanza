const express = require("express");
const mysql = require("mysql2");
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
// app.js

// Función para agregar un producto

// Configuración de la conexión a la base de datos
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'LaDesesperanza'
});

con.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conexión a la base de datos establecida.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Agregar producto
app.post('/agregarProducto', (req, res) => {
    const { nombre, tipo, precio, cantidad } = req.body;

    con.query('INSERT INTO Productos (nombre, tipo, precio, cantidad) VALUES (?, ?, ?, ?)', 
    [nombre, tipo, precio, cantidad], (err, respuesta) => {
        if (err) {
            console.error("Error al agregar el producto:", err);
            return res.status(500).send("Error al agregar el producto");
        }
        return res.send(`Producto ${nombre} agregado correctamente.`);
    });

});

// Obtener productos


// Actualizar producto
app.put('/actualizarProducto/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, tipo, precio, cantidad } = req.body;

    con.query('UPDATE Productos SET nombre = ?, tipo = ?, precio = ?, cantidad = ? WHERE producto_id = ?', 
    [nombre, tipo, precio, cantidad, id], (err, resultado) => {
        if (err) {
            console.error("Error al actualizar el producto:", err);
            return res.status(500).send("Error al actualizar el producto");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        return res.send(`Producto con ID ${id} actualizado correctamente.`);
    });
});

// Eliminar producto
app.delete('/borrarProducto/:id', (req, res) => {
    const id = req.params.id;

    con.query('DELETE FROM Productos WHERE producto_id = ?', [id], (err, resultado) => {
        if (err) {
            console.error("Error al borrar el producto:", err);
            return res.status(500).send("Error al borrar el producto");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        return res.send(`Producto con ID ${id} borrado correctamente.`);
    });
});
app.get('/obtenerProductos', (req, res) => {
    con.query('SELECT * FROM Productos', (err, respuesta) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).send("Error al obtener productos");
        }

        return res.json(respuesta); // Devuelve la lista de productos en formato JSON
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
