import express, { NextFunction } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';

import { Event, Command, Session, Exception } from './entity/index.js';

import config from './config.json' assert { type: 'json' };
interface MojangAuth {
	serverId: string;
	selectedProfile: string;
	accessToken: string;
}

const { AUTH_SERVER, JWT_SECRET, EXPIRE_TIME_SECS, DB, PORT } = config;

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

	const hashedServerId = crypto
		.createHash('sha256')
		.update(serverId)
		.digest('hex')
		.toString();

	const session = new Session();

	session.hashed_uuid = hashedServerId;
	session.start = new Date();
	session.end = new Date(Date.now() + EXPIRE_TIME_SECS * 1000);

	await AppDataSource.manager.save(session);

	const token = jwt.sign({ hashedServerId }, JWT_SECRET, {
		expiresIn: EXPIRE_TIME_SECS,
	});

	res.send(token);
});

v1.post('/session/refresh', async (req, res) => {
	const decoded = verifyToken(req.body.token, true);
	if (typeof decoded === 'string') return res.status(403).send(decoded);

	const authRes = await fetch(AUTH_SERVER, {
		method: 'POST',
		body: JSON.stringify(req.body),
	});

	if (authRes.status === 403)
		return res.status(403).send('Invalid credentials');

	const hashedServerId = crypto
		.createHash('sha256')
		.update(req.body.serverId)
		.digest('hex')
		.toString();

	if (hashedServerId !== req.body.hashedServerId)
		return res.status(403).send('UUIDs do not match');

	const sessionRepository = AppDataSource.getRepository(Session);

	const session = await findLatestSessionByUUID(
		decoded.hashedServerId,
		sessionRepository,
	);

	session.end = new Date(Date.now() + EXPIRE_TIME_SECS * 1000);

	sessionRepository.save(session);

	const token = jwt.sign(
		{ hashedServerId: decoded.hashedServerId },
		JWT_SECRET,
		{
			expiresIn: EXPIRE_TIME_SECS,
		},
	);

	res.send(token);
});

v1.post('/exception', authenticationMiddleware, async (req, res) => {
	const exception = new Exception();

	exception.reported_at = new Date();
	exception.session = req.body.session;
	exception.is_fatal = req.body.is_fatal;
	exception.stack_trace = req.body.stack_trace;

	await AppDataSource.manager.save(exception);

	res.sendStatus(200);
});

v1.post('/command', authenticationMiddleware, async (req, res) => {
	const command = new Command();

	command.reported_at = new Date();
	command.session = req.body.session;
	command.command = req.body.command;

	await AppDataSource.manager.save(command);

	res.sendStatus(200);
});

async function findLatestSessionByUUID(
	uuid: string,
	sessionRepository: Repository<Session>,
) {
	return await sessionRepository
		.createQueryBuilder('session')
		.where('session.hashed_uuid = :uuid', { uuid })
		.orderBy('session.start', 'DESC')
		.take(1)
		.getOne();
}

async function authenticationMiddleware(req, res, next: NextFunction) {
	const token = req.body.token;

	const decoded = verifyToken(token);
	if (typeof decoded === 'string') return res.status(403).send(decoded);

	const sessionRepository = AppDataSource.getRepository(Session);

	try {
		const session = await findLatestSessionByUUID(
			decoded.hashedServerId,
			sessionRepository,
		);

		req.body.session = session;
	} catch (err) {
		return res.status(403).send('Failed to find latest session');
	}

	req.body.hashedServerId = decoded.hashedServerId;

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

app.listen(PORT);
