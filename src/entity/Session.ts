import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event.js';

@Entity()
export class Session {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	hashed_uuid: string;

	@Column()
	start: Date;

	@Column()
	end: Date;

	@OneToMany(() => Event, event => event.session)
	events: Event[];
}
