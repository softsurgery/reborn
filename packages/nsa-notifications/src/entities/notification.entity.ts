import { EntityHelper } from 'nsa-database';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from 'nsa-notifications/enums/notification-type.registry';
import { AbstractUserEntity } from 'nsa-um/entities/abstract-user.entity';

@Entity('notification')
export class NotificationEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: NotificationType, nullable: true })
  type: NotificationType;

  @ManyToOne(() => AbstractUserEntity, (user) => user.notifications, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'json', nullable: true })
  payload?: object;

  @Column({
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  readAt?: Date;
}
