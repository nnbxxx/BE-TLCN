import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VectorStoreService } from './vector-store.service';
import { Vector, VectorSchema } from './schemas/vector-store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vector.name, schema: VectorSchema }]),
  ],
  providers: [VectorStoreService],
  exports: [VectorStoreService, MongooseModule], // <-- phải export MongooseModule nếu muốn dùng model ở nơi khác
})
export class VectorStoreModule { }