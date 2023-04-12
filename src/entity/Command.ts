import { ChildEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event.js';

@ChildEntity()
export class Command extends Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	command: string;
}
