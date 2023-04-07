import { Session } from './Session.js';
import { Command } from './Command.js';
import { Exception } from './Exception.js';

import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Session, session => session.actions)
	session: Session;

	@Column()
	reported_at: Date;
}
