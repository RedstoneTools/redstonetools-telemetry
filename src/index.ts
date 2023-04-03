import express from 'express';
import postgres from 'postgres';

const sql = postgres(); // Uses environment variables for database connection (https://www.postgresql.org/docs/current/libpq-envars.html)

const app = express();

const v1 = express.Router();

app.use('/api/v1', v1);

// /api/v1/crash
// /api/v1/error
// /api/v1/command

v1.post('/crash', (req, res) => {
	res.sendStatus(200);
});

v1.post('/error', (req, res) => {
	res.sendStatus(200);
});

v1.post('/command', (req, res) => {
	res.sendStatus(200);
});

app.listen(3000);
