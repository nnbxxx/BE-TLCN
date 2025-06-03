import { PartialType } from '@nestjs/swagger';
import { CreateVectorStoreDto } from './create-vector-store.dto';

export class UpdateVectorStoreDto extends PartialType(CreateVectorStoreDto) {}
