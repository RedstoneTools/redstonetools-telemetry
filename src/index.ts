import express, { NextFunction } from 'express';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from './config.json' assert { type: 'json' };

const { AUTH_SERVER, JWT_SECRET, EXPIRE_TIME_SECS } = config;

const sql = postgres(); // Uses environment variables for database connection (https://www.postgresql.org/docs/current/libpq-envars.html)

const app = express();

const v1 = express.Router();

app.use(express.json());

// app.use((req, res, next) => {
// 	jwt.verify(req.body.token, JWT_SECRET);
// });

app.use('/api/v1', v1);

interface MojangAuth {
	serverId: string;
	selectedProfile: string;
	accessToken: string;
}

v1.post('/session/create', async (req, res) => {
	const { serverId, selectedProfile, accessToken }: MojangAuth = req.body;

	const authRes = await fetch(AUTH_SERVER, {
		method: 'POST',
		body: JSON.stringify(req.body),
	});

	if (authRes.status === 403)
		return res.status(403).send('Invalid credentials');

	const hashedServerId = await bcrypt.hash(serverId, 10);

	const token = jwt.sign({ hashedServerId }, JWT_SECRET, {
		expiresIn: EXPIRE_TIME_SECS,
	});

	res.send(token);
});

v1.post('/crash', verifyToken, (req, res) => {
	res.sendStatus(200);
});

v1.post('/error', verifyToken, (req, res) => {
	res.sendStatus(200);
});

v1.post('/command', verifyToken, (req, res) => {
	res.sendStatus(200);
});

function verifyToken(req, res, next: NextFunction) {
	const token = req.body.token;
	if (!token)
		return res.status(403).send('Could not find token in request body');

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			if (err.name === 'TokenExpiredError')
				return res.status(403).send(`Token expired at ${err.expiredAt}`);

			return res.status(403).send('Invalid Credentials');
		}

		req.body.hashedServerId = decoded.hashedServerId;
		next();
	});
}
app.listen(3000);
