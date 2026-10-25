import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestClientSpecializedSignUpDto } from '../dtos/custom-auth/request-client-specialized-signup.dto';
import { BasicRoles } from 'nsa-um/enums/basic-roles.enum';
import { MailService } from 'nsa-mail/services/mail.service';
import { ClientAuthService } from 'nsa-auth/services/client-auth.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationNamespaceService } from 'nsa-configurations/services/configuration-namespace.service';
import { StorageService } from 'nsa-storage/services/storage.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class CustomAuthService extends ClientAuthService {
  constructor(
    protected readonly userService: UserService,
    protected readonly mailService: MailService,
    protected readonly userRepository: UserRepository,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly configurationNamespaceService: ConfigurationNamespaceService,
    protected readonly storageService: StorageService,
  ) {
    super(
      userRepository,
      userService,
      jwtService,
      configService,
      mailService,
      storageService,
      configurationNamespaceService,
    );
  }

  async extendedSignup(
    request: RequestClientSpecializedSignUpDto,
  ): Promise<UserEntity | null> {
    const { ...rest } = request;
    try {
      const result = (await this.userService.save({
        ...rest,
        roleId: BasicRoles.User,
        isActive: true,
      })) as UserEntity | null;

      return result;
    } catch (error) {
      throw new BadRequestException(`User registration failed: ${error}`);
    }
  }
}
