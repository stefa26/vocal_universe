const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.POSTGRESQL_EXTERNAL_DB;
const pool = new Pool({
    connectionString,
});

// CRUD Routes (implement these functions below)
route.get("/curso", getCurso); // GET all curso
route.post("/curso", createCurso); // POST a new curso
route.get("/curso/:id", getCursoById); // GET a curso by ID
route.put("/curso/:id", updateCurso); // PUT update a curso
route.delete("/curso/:id", deleteCurso); // DELETE delete a curso


// ☺ ♦
async function getCurso(req, res) {
    try {
        // Obtener todos los "curso" de la base de datos
        const client = await pool.connect();
        const results = await client.query("SELECT * FROM curso");
        const curso = results.rows;
        res.status(200).json(curso);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving curso");
    }
}

// ☺ ♦  
async function createCurso(req, res) {
    try {
        // Validar la entrada del body
        const { name_curso, identificador, videos } = req.body;
        if (!name_curso) {
            return res.status(400).send("Missing name_curso");
        }
        if (!identificador) {
            return res.status(400).send("Missing identificador");
        }
        if (!videos) {
            return res.status(400).send("Missing videos");
        }
        
        // Crear un nuevo "curso" en la base de datos
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO curso (name_curso, identificador, videos) VALUES ($1, $2, $3) RETURNING *",
            [name_curso, identificador, videos],
        );
        const newcurso = result.rows[0];
        res.status(201).json(newcurso);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating curso");
    }
}

// ☺ ♦
async function getCursoById(req, res) {
    try {
        // Obtener un "curso" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("SELECT * FROM curso WHERE id = $1", [
            id,
        ]);
        const curso = result.rows[0];
        if (!curso) {
            return res.status(404).send("curso not found");
        }
        res.status(200).json(curso);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving curso");
    }
}

// ☺ ♦
async function updateCurso(req, res) {
    try {
        // Actualizar un "curso" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const { name_curso, identificador, videos} = req.body;
        if (!name_curso) {
            return res.status(400).send("Missing name_curso");
        }
        if (!identificador) {
            return res.status(400).send("Missing identificador");
        }
        if (!videos) {
            return res.status(400).send("Missing videos");
        }
        

        const client = await pool.connect();
        const result = await client.query(
            "UPDATE curso SET name_curso = $1, identificador = $2, videos = $3 WHERE id = $4 RETURNING *",
            [name_curso, identificador, videos, id],
        );
        const updatedcurso = result.rows[0];
        if (!updatedcurso) {
            return res.status(404).send("curso not found");
        }
        res.status(200).json(updatedcurso);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating curso"); 
       }
}

// ☺ ♦
async function deleteCurso(req, res) {
    try {
        // Eliminar un "curso" por ID
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send("Invalid ID");
        }

        const client = await pool.connect();
        const result = await client.query("DELETE FROM curso WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("curso not found");
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting curso");
      }
}

module.exports = route; 