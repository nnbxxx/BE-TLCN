import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public')); //js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //view 
  // config port
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  // config security
  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,X-Custom-Header',
    exposedHeaders: 'X-Custom-Header,X-Another-Header',
    credentials: true,
    preflightContinue: true,
  });

  const reflector = app.get(Reflector);
  // public decorator
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // config tools
  // app.use(compression())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'] //v1, v2
  });

  //config cookies
  app.use(cookieParser());


  await app.listen(port);

}
bootstrap();
