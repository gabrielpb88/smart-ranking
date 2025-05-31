import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(_id: string): string {
    if (!isValidObjectId(_id)) {
      throw new RpcException('Invalid _id format');
    }
    return _id;
  }
}