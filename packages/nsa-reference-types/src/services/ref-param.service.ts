import { Injectable } from '@nestjs/common';
import { RefParamEntity } from '../entities/ref-param.entity';
import { AbstractCrudService } from 'nsa-database';
import { RefParamRepository } from '../repositories/ref-param.repository';

@Injectable()
export class RefParamService extends AbstractCrudService<RefParamEntity> {
  constructor(private readonly refParamRepository: RefParamRepository) {
    super(refParamRepository);
  }
}
