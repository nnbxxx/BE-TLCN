import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VectorStoreService } from './vector-store.service';
import { VectorDocument, VectorSchema } from './schemas/vector-store.schema';
import { Document, DocumentSchema } from './schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VectorDocument.name, schema: VectorSchema }, { name: Document.name, schema: DocumentSchema }]),
  ],
  providers: [VectorStoreService],
  exports: [VectorStoreService, MongooseModule], // <-- phải export MongooseModule nếu muốn dùng model ở nơi khác
})
export class VectorStoreModule { }