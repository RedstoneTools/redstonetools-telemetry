import express from 'express';
import postgres from 'postgres';

const sql = postgres(); // Uses environment variables for database connection (https://www.postgresql.org/docs/current/libpq-envars.html)

const app = express();

const v1 = express.Router();

app.use(express.json());
app.use('/api/v1', v1);

interface MojangAuth {
	uuid: String;
	profile_id: String;
	access_token: String;
}

v1.post('/session/create', (req, res) => {
	const { uuid, profile_id, access_token }: MojangAuth = req.body;
});

v1.post('/session/refresh', (req, res) => {
	const { uuid, profile_id, access_token }: MojangAuth = req.body;
});

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
