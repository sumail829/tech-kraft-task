import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";
import { Agent } from "./agent";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Index()
  @Column()
  suburb!: string;

  @Index()
  @Column()
  propertyType!: string;

  @Index()
  @Column()
  price!: number;

  @Column()
  beds!: number;

  @Column()
  baths!: number;

  @Column({ nullable: true })
  internalStatusNotes?: string;

  @ManyToOne(() => Agent, (agent) => agent.properties, { eager: true })
  agent?: Agent;
}