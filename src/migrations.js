const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.POSTGRESQL_EXTERNAL_DB;
const pool = new Pool({
    connectionString,
});



pool.connect((err) => {
    console.log(err);
    if (err) {
        console.log('error de conexion');
    }
    else{console.log('Conectado a la base de datos postgres');}
    
});
const queries = [
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        phone VARCHAR NOT NULL,
        age VARCHAR NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`, `CREATE TABLE IF NOT EXISTS curso (
        id SERIAL PRIMARY KEY,
        name_curso VARCHAR(255) NOT NULL,
        identificador VARCHAR(255) NOT NULL,
        videos VARCHAR(255) NOT NULL
     );`, `CREATE TABLE IF NOT EXISTS materialapoyo (
        id SERIAL PRIMARY KEY, 
        name_material VARCHAR(255) NOT NULL,
        actividad VARCHAR(255) NOT NULL
    );`
]

// ☺ ♦ Reemplaza las funciones vacías con tu lógica específica:
async function createDatabase(req, res) {
    try {
        const client = await pool.connect();
        // Obtener todos los "todos" de la base de datos
        let results = null;
        for (al in queries) {
            results = await client.query(queries[al]);
        }
        const todos = results.rows;
        res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al recuperar todos");
    }
}

route.get("", createDatabase);

module.exports = route; 