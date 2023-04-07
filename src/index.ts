import express, { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Event, Command, Session, Exception } from './entity/index.js';

import config from './config.json' assert { type: 'json' };
interface MojangAuth {
	serverId: string;
	selectedProfile: string;
	accessToken: string;
}

const { AUTH_SERVER, JWT_SECRET, EXPIRE_TIME_SECS, DB } = config;

const app = express();

const v1 = express.Router();

app.use(express.json());

app.use('/api/v1', v1);

const AppDataSource = new DataSource({
	type: 'postgres',
	entities: [Session, Event, Command, Exception],
	synchronize: true,
	...DB,
});

await AppDataSource.initialize().catch(console.error);

v1.post('/session/create', async (req, res) => {
	const { serverId, selectedProfile, accessToken }: MojangAuth = req.body;

	const authRes = await fetch(AUTH_SERVER, {
		method: 'POST',
		body: JSON.stringify(req.body),
	});

	if (authRes.status === 403)
		return res.status(403).send('Invalid credentials');

	const hashedServerId = await bcrypt.hash(serverId, 10);

	const session = new Session();

	session.hashed_uuid = hashedServerId;

	const newSession = await AppDataSource.manager.save(session);

	const token = jwt.sign(
		{ hashedServerId, sessionId: newSession.id },
		JWT_SECRET,
		{
			expiresIn: EXPIRE_TIME_SECS,
		},
	);

	res.send(token);
});

v1.post('/session/refresh', async (req, res) => {});

v1.post('/exception', verifyTokenMiddleware, (req, res) => {
	res.sendStatus(200);
});

v1.post('/command', verifyTokenMiddleware, (req, res) => {
	res.sendStatus(200);
});

function verifyTokenMiddleware(req, res, next: NextFunction) {
	const token = req.body.token;

	const decoded = verifyToken(token);
	if (decoded === 'NoToken')
		return res.status(403).send('Could not find token in request body');
	if (decoded === 'TokenExpired') return res.status(403).send('Token Expired');
	if (decoded === 'InvalidToken')
		return res.status(403).send('Invalid Credentials');

	if (typeof decoded === 'string') return res.status(403).send('Unkown Error');

	req.body.hashedServerId = decoded.hashedServerId;
	req.body.sessionId = decoded.sessionId;

	next();
}

function verifyToken(token, allowExpired = false) {
	if (!token) return 'NoToken';

	let output: string | jwt.JwtPayload;

	jwt.verify(token, JWT_SECRET, (err, decoded: string | jwt.JwtPayload) => {
		if (err) {
			if (err.name === 'TokenExpiredError' && !allowExpired)
				return 'TokenExpired';
			return 'InvalidToken';
		}

		output = decoded;
	});

	return output;
}

app.listen(3000);
