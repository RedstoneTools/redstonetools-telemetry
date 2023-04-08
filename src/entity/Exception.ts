import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Event } from './Event.js';

@Entity()
export class Exception extends Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	stack_trace: string;

	@Column()
	is_fatal: boolean;
}
