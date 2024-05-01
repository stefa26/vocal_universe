const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require('dotenv');
const path = require('path')
const { Pool } = require("pg");
const bcrypt = require('bcrypt');

require('dotenv').config();

//Routes
const migrationsRouter = require('./migrations');
const cursoRouter = require('./curso');
const materialapoyoRouter = require('./materialapoyo');
const usersRouter = require('./users');
const registroRouter = require('./registro');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
dotenv.config();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', migrationsRouter);
app.use('/', cursoRouter);
app.use('/', materialapoyoRouter);
app.use('/', usersRouter);
app.use('/', registroRouter);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const pool = new Pool({ connectionString: process.env.POSTGRESQL_EXTERNAL_DB });

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
            return;
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
