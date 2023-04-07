import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Action } from './Action';

@Entity()
export class Exception {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Action, action => action.exceptions)
	action: Action;

	@Column()
	stacktrace: string;

	@Column()
	is_fatal: boolean;

	@Column()
	created_at: Date;

	@Column()
	updated_at: Date;
}
