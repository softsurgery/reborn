import { Module } from '@nestjs/common';
import { BugController } from 'src/modules/system-reports/controllers/bug.controller';
import { FeedbackController } from 'src/modules/system-reports/controllers/feedback.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { AuthModule } from 'nsa-auth/auth.module';
import { AuthController } from 'nsa-auth/controllers/auth.controller';
import { LoggerModule } from 'nsa-logger/logger.module';
import { ClientAuthController } from 'nsa-auth/controllers/client-auth.controller';
import { JobController } from 'src/modules/job-management/controllers/job.controller';
import { JobManagementModule } from 'src/modules/job-management/job-management.module';
import { JobRequestController } from 'src/modules/job-management/controllers/job-request.controller';
import { JobRequestWorkflowController } from 'src/modules/job-management/controllers/job-request-workflow.controller';
import { ConversationController } from 'nsa-chat/controllers/conversation.controller';
import { ChatModule } from 'nsa-chat/chat.module';
import { MessageController } from 'nsa-chat/controllers/message.controller';
import { JobSaveController } from 'src/modules/job-management/controllers/job-save.controller';
import { JobViewController } from 'src/modules/job-management/controllers/job-view.controller';
import { JobStatisticsController } from 'src/modules/job-management/controllers/job-statistics.controller';
import { NotificationController } from 'nsa-notifications/controllers/notification.controller';
import { NotificationModule } from 'nsa-notifications/notifications.module';
import { RefTypeController } from 'nsa-reference-types/controllers/ref-type.controller';
import { RefParamController } from 'nsa-reference-types/controllers/ref-param.controller';
import { ReferenceTypesModule } from 'nsa-reference-types/reference-types.module';
import { StorageController } from 'nsa-storage/controllers/storage.controller';
import { StorageFolderController } from 'nsa-storage/controllers/storage-folder.controller';
import { FollowController } from 'src/modules/users/controllers/follow.controller';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { StorageModule } from 'nsa-storage/storage.module';
import { EducationController } from 'src/modules/users/controllers/education.controller';
import { ExperienceController } from 'src/modules/users/controllers/experience.controller';
import { CurrentConversationController } from 'nsa-chat/controllers/user-conversation.controller';
import { CurrentJobController } from 'src/modules/job-management/controllers/current-job.controller';
import { ConfigurationController } from 'nsa-configurations/controllers/configuration.controller';
import { ConfigurationsModule } from 'nsa-configurations/configurations.module';
import { JobWorkflowController } from 'src/modules/job-management/controllers/job-workflow.controller';
import { TaskController } from 'nsa-tasks/controllers/task.controller';
import { TasksModule } from 'nsa-tasks/tasks.module';
import { FinanceController } from '../../modules/finance/controllers/finance.controller';
import { FinanceModule } from 'src/modules/finance/finance.module';
import { UserBlockController } from 'src/modules/users/controllers/user-block.controller';
import { CurrentUserController } from 'src/modules/users/controllers/current-user.controller';

@Module({
  controllers: [
    //auth
    AuthController,
    ClientAuthController,
    CurrentUserController,
    ExperienceController,
    EducationController,
    //common
    StorageController,
    StorageFolderController,
    //user
    FollowController,
    UserBlockController,
    //system reports
    FeedbackController,
    BugController,
    //job-management
    CurrentJobController,
    JobController,
    JobWorkflowController,
    JobRequestWorkflowController,
    JobRequestController,
    JobSaveController,
    JobViewController,
    JobStatisticsController,
    //chat
    ConversationController,
    MessageController,
    CurrentConversationController,
    //notifications
    NotificationController,
    RefTypeController,
    RefParamController,
    ConfigurationController,
    TaskController,
    //finance
    FinanceController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    LoggerModule,
    SystemReportsModule,
    UserManagementModule,
    StorageModule,
    JobManagementModule,
    ChatModule,
    NotificationModule,
    ReferenceTypesModule,
    ConfigurationsModule,
    TasksModule,
    FinanceModule,
  ],
})
export class RoutesModule {}
