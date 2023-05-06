import { ChildEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event.js';

@ChildEntity()
export class Exception extends Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	stack_trace: string;

	@Column()
	is_fatal: boolean;
}
