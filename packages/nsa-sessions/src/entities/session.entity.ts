import { SessionType } from 'nsa-sessions/enums/session-type.registry';
import { AbstractUserEntity } from 'nsa-um/entities/abstract-user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AbstractUserEntity, (user) => user.sessions, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: SessionType, nullable: true })
  type: SessionType;

  @Column({ type: 'timestamp', nullable: true })
  planned_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  planned_end: Date;

  @Column({ type: 'timestamp', nullable: true })
  started: Date;

  @Column({ type: 'timestamp', nullable: true })
  ended: Date;

  @Column({ type: 'json', nullable: true })
  payload?: object;
}
