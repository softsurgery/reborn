import { Module } from '@nestjs/common';
import { BugController } from 'src/modules/system-reports/controllers/bug.controller';
import { FeedbackController } from 'src/modules/system-reports/controllers/feedback.controller';
import { SystemReportsModule } from 'src/modules/system-reports/system-reports.module';
import { AuthModule } from '@softsurgery/nsa-auth/auth.module';
import { AuthController } from '@softsurgery/nsa-auth/controllers/auth.controller';
import { LoggerModule } from '@softsurgery/nsa-logger/logger.module';
import { ClientAuthController } from '@softsurgery/nsa-auth/controllers/client-auth.controller';
import { JobController } from 'src/modules/job-management/controllers/job.controller';
import { JobManagementModule } from 'src/modules/job-management/job-management.module';
import { JobRequestController } from 'src/modules/job-management/controllers/job-request.controller';
import { JobRequestWorkflowController } from 'src/modules/job-management/controllers/job-request-workflow.controller';
import { ConversationController } from '@softsurgery/nsa-chat/controllers/conversation.controller';
import { ChatModule } from '@softsurgery/nsa-chat/chat.module';
import { MessageController } from '@softsurgery/nsa-chat/controllers/message.controller';
import { JobSaveController } from 'src/modules/job-management/controllers/job-save.controller';
import { JobViewController } from 'src/modules/job-management/controllers/job-view.controller';
import { JobStatisticsController } from 'src/modules/job-management/controllers/job-statistics.controller';
import { NotificationController } from '@softsurgery/nsa-notifications/controllers/notification.controller';
import { NotificationModule } from '@softsurgery/nsa-notifications/notifications.module';
import { RefTypeController } from '@softsurgery/nsa-reference-types/controllers/ref-type.controller';
import { RefParamController } from '@softsurgery/nsa-reference-types/controllers/ref-param.controller';
import { ReferenceTypesModule } from '@softsurgery/nsa-reference-types/reference-types.module';
import { StorageController } from '@softsurgery/nsa-storage/controllers/storage.controller';
import { StorageFolderController } from 'src/modules/storage-folder/controllers/storage-folder.controller';
import { FollowController } from 'src/modules/users/controllers/follow.controller';
import { UserManagementModule } from 'src/modules/users/user-management.module';
import { StorageModule } from '@softsurgery/nsa-storage/storage.module';
import { EducationController } from 'src/modules/users/controllers/education.controller';
import { ExperienceController } from 'src/modules/users/controllers/experience.controller';
import { CurrentConversationController } from '@softsurgery/nsa-chat/controllers/user-conversation.controller';
import { CurrentJobController } from 'src/modules/job-management/controllers/current-job.controller';
import { ConfigurationController } from '@softsurgery/nsa-configurations/controllers/configuration.controller';
import { ConfigurationsModule } from '@softsurgery/nsa-configurations/configurations.module';
import { JobWorkflowController } from 'src/modules/job-management/controllers/job-workflow.controller';
import { TaskController } from 'src/modules/tasks/controllers/task.controller';
import { TasksModule } from 'src/modules/tasks/tasks.module';
import { FinanceController } from '../../modules/finance/controllers/finance.controller';
import { FinanceModule } from 'src/modules/finance/finance.module';
import { UserBlockController } from 'src/modules/users/controllers/user-block.controller';
import { CurrentUserController } from 'src/modules/users/controllers/current-user.controller';
import { StorageFolderModule } from 'src/modules/storage-folder/storage-folder.module';

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
    StorageFolderModule,
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
