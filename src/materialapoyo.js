const express = require("express");
const route = express.Router();
const { Pool }  = require("pg");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.POSTGRESQL_EXTERNAL_DB;
const pool = new Pool({
    connectionString,
});


// CRUD Routes (implement these functions below)
route.get("/materialapoyo", getmaterialapoyo); // GET all materialapoyo
route.post("/materialapoyo", creatematerialapoyo); // POST a new materialapoyo
route.get("/materialapoyo/:id", getmaterialapoyoById); // GET a materialapoyo only by ID
route.put("/materialapoyo/:id", updatematerialapoyo); // PUT update a materialapoyo
route.delete("/materialapoyo/:id", deletematerialapoyo); // DELETE delete a materialapoyo

// ☺ ♦ ♣


async function getmaterialapoyo(req, res) {
    try {
        // Obtener todos los "materialapoyo" de la base de datos
        const client = await pool.connect()
        const results = await client.query("SELECT * FROM materialapoyo");
        const materialapoyo = results.rows;
        res.status(200).json(materialapoyo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving materialapoyo");
    }
}

// ☺ ♦ ♣
async function creatematerialapoyo(req, res) {
    try {
        // Validar la entrada del body
        const { name_material, actividad} = req.body;
        if (!name_material) {
            return res.status(400).send("Missing name_material");
        }
        if (!actividad) {
            return res.status(400).send("Missing actividad");
        }
        // Crear un nuevo "materialapoyo" en la base de datos
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO materialapoyo (name_material, actividad) VALUES ($1, $2, $3) RETURNING *",
            [name_material, actividad],
        );
        const newmaterialapoyo = result.rows[0];
        res.status(201).json(newmaterialapoyo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating materialapoyo");
    }
}

async function login(req, res){
    const { email, password } = req.body;//cambiar a corde al html del login

    const client = await pool.connect();
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.sendFile(__dirname + '/public/html/login.html');//si te equivocas te manda al login usar tu logica para ir al login
    }
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].passw);
    if (!isPasswordValid) {
        return res.sendFile(__dirname + '/public/html/login.html');//si te equivocas te manda al login usar tu logica para ir al login
    }
    
    res.sendFile(__dirname + '/public/html/index.html');//si es correcto logica de redireccion a la pagina principal
};

async function getmaterialapoyoById(req, res) {
    try {
        // Obtener un "materialapoyo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM materialapoyo WHERE id = $1", [
            id,
        ]);
        const materialapoyo = result.rows[0];
        if (!materialapoyo) {
            return res.status(404).send("materialapoyo not found");
        }
        res.status(200).json(materialapoyo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving materialapoyo");
    }
}

// ☺ ♦
async function updatematerialapoyo(req, res) {
    try {
        // Actualizar un "materialapoyo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const { name_material, actividad } = req.body;
        if (!name_material) {
            return res.status(400).send("Missing name_material");
        }
        if (!actividad) {
            return res.status(400).send("Missing actividad");
        }

        const client = await pool.connect();
        const result = await client.query(
            "UPDATE materialapoyo SET name_material = $1, actividad = $2 WHERE id = $3 RETURNING *",
            [name_material, actividad, id]
        );
        const updatedmaterialapoyo = result.rows[0];
        if (!updatedmaterialapoyo) {
            return res.status(404).send("materialapoyo not found");
        }
        res.status(200).json(updatedmaterialapoyo);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating materialapoyo");
    }
}

// ☺ ♦
async function deletematerialapoyo(req, res) {
    try {
        // Eliminar un "materialapoyo" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("DELETE FROM materialapoyo WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("materialapoyo not found");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting materialapoyo");
    }
}

module.exports = route; 