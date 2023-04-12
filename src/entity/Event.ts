import { Session } from './Session.js';

import {
	Column,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Session, session => session.events, { cascade: true })
	session: Session;

	@Column()
	reported_at: Date;
}
