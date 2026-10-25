import { EntityHelper } from 'nsa-database';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import type { LogEntity } from 'nsa-logger/entities/log.entity';
import type { NotificationEntity } from 'nsa-notifications/entities/notification.entity';
import type { SessionEntity } from 'nsa-sessions/entities/session.entity';
import { OAuthProvider } from 'nsa-auth/enums/oauth.enum';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class AbstractUserEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'datetime', nullable: true })
  dateOfBirth?: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerified?: Date;

  @Column({
    type: 'enum',
    enum: OAuthProvider,
    nullable: true,
    default: OAuthProvider.EMAIL,
  })
  source?: OAuthProvider;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({})
  roleId: string;

  @OneToMany('LogEntity', (log: any) => log.user)
  logs?: LogEntity[];

  @OneToMany('NotificationEntity', (notif: any) => notif.user)
  notifications?: NotificationEntity[];

  @OneToMany('SessionEntity', (session: any) => session.user)
  sessions?: SessionEntity[];

  @OneToMany('TaskEntity', (task: any) => task.user)
  tasks?: unknown[];

  @Column({ type: 'timestamp', nullable: true })
  lastSeen?: Date;
}
