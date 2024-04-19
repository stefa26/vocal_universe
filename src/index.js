const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require('dotenv');
const path = require('path')
const migrationsRouter = require('./migrations');
//Routes
const cursoRouter = require('./curso');
const materialapoyoRouter = require('./materialapoyo');
const usersRouter = require('./users');
const registroRouter = require('./registro');

// conf dotenv
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Configure body-parser middleware

app.use(cors());
dotenv.config();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public')));

// Error handler middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo salio mal!");
});

app.use('/', migrationsRouter);
app.use('/', cursoRouter);
app.use('/', materialapoyoRouter);
app.use('/', usersRouter);
app.use('/', registroRouter);

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        if (result.rows.length === 0) {
            res.status(401).send('Credenciales inválidas');
        } else {
            res.status(200).json({ success: true });
        }
    });
});

// app.get('/', (req, res) => {
//     res.status(200).send('Hola mundo');
// });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
