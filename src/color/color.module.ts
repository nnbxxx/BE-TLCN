import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, ColorSchema } from './schemas/color.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Color.name, schema: ColorSchema }])],
  exports: [ColorService],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule { }
