import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Action } from './Action';

@Entity()
export class Command {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Action, action => action.commands)
	action: Action;

	@Column()
	command: string;

	@Column()
	created_at: Date;

	@Column()
	updated_at: Date;
}
