import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Agent } from "./agent";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  suburb: string;

  @Column()
  propertyType: string;

  @Column()
  price: number;

  @Column()
  beds: number;

  @Column()
  baths: number;

  @Column({ nullable: true })
  internalStatusNotes: string;

  @ManyToOne(() => Agent)
  agent: Agent;
}