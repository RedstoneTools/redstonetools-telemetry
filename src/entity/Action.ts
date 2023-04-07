import { Session } from './Session';
import { Command } from './Command';
import { Exception } from './Exception';

import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Action {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Session, session => session.actions)
	session: Session;

	@OneToMany(() => Command, command => command.action)
	commands: Command[];

	@OneToMany(() => Exception, exception => exception.action)
	exceptions: Exception[];

	@Column()
	created_at: Date;

	@Column()
	updated_at: Date;
}
