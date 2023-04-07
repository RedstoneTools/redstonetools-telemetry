import express, { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Action, Command, Session, Exception } from './entity';

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
	entities: [Session, Action, Command, Exception],
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

	const token = jwt.sign({ hashedServerId }, JWT_SECRET, {
		expiresIn: EXPIRE_TIME_SECS,
	});

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
	// if (!token)
	// 	return res.status(403).send('Could not find token in request body');

	// jwt.verify(token, JWT_SECRET, (err, decoded) => {
	// 	if (err) {
	// 		if (err.name === 'TokenExpiredError')
	// 			return res.status(403).send(`Token expired at ${err.expiredAt}`);

	// 		return res.status(403).send('Invalid Credentials');
	// 	}

	// 	req.body.hashedServerId = decoded.hashedServerId;
	// 	next();
	// });

	const decoded = verifyToken(token);
	if (decoded === 'NoToken')
		return res.status(403).send('Could not find token in request body');
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
