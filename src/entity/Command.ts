import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Event } from './Event.js';

@Entity()
export class Command extends Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	command: string;
}
