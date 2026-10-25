import { EntityHelper } from '@softsurgery/nsa-database';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskVariant } from '../enums/task-variant.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { AbstractUserEntity } from '@softsurgery/nsa-um/entities/abstract-user.entity';

@Entity('tasks')
export class TaskEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TaskVariant, default: TaskVariant.GENERAL })
  variant: TaskVariant;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ type: 'datetime', nullable: true })
  dueDate?: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => AbstractUserEntity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;
}
