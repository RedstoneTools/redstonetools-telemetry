import { Session } from './Session.js';

import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export abstract class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Session, session => session.events, { cascade: true })
	session: Session;

	@Column()
	reported_at: Date;
}
