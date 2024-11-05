import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto, FileUploadDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService, private cloudinaryService: CloudinaryService) { }
  @ResponseMessage("Upload a new file")
  @Public()
  @Patch("/file")
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: "Uploads a single file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        }
      }
    }
  })
  async uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^(jpg|jpeg|png|image\/png|gif|txt|pdf|application\/pdf|doc|docx|text\/plain)$/i,
      })
      .addMaxSizeValidator({
        maxSize: 100 * 1024 * 1024 //kb = 1 MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File) {
    const imgUrl = (await this.cloudinaryService.uploadFile(file, 'new-img')).url
    //console.log("🚀 ~ FilesController ~ imgUrl:", imgUrl)
    return imgUrl;
  }
  @ResponseMessage("Upload multiple new file")
  @Public()
  @Patch("/files")
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Uploads multiple files" })
  @UseInterceptors(FilesInterceptor("files", 10))
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary"
          }
        }
      }
    }
  })
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(jpg|jpeg|png|image\/png|gif|txt|pdf|application\/pdf|doc|docx|text\/plain)$/i,
        })
        .addMaxSizeValidator({
          maxSize: 100 * 1024 * 1024 //kb = 1 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),) files: Express.Multer.File[],
  ) {
    if (files) {
      const resultUpload = await this.cloudinaryService.uploadMultipleFile(files, 'new-img-files');
      return resultUpload
    }

  }
  // @Post()
  // create(@Body() createFileDto: CreateFileDto) {
  //   return this.filesService.create(createFileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
