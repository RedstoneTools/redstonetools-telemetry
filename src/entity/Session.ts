import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Action } from './Action';

@Entity()
export class Session {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	hashed_uuid: string;

	@Column()
	ended_at: Date;

	@OneToMany(() => Action, action => action.session)
	actions: Action[];
}
