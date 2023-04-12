import { Session } from './Session.js';

import {
	Column,
	ManyToOne,
	PrimaryGeneratedColumn,
	Entity,
	TableInheritance,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Session, session => session.events, { onDelete: 'CASCADE' })
	session: Session;

	@Column()
	reported_at: Date;
}
