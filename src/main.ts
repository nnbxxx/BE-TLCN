import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // get port from .env
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  // config middleware: use metedata
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // enable jwt-guard globally
  app.useGlobalInterceptors(new TransformInterceptor(reflector)); // transform-interceptor

  //config view engine
  app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, image
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // view html
  app.setViewEngine('ejs');

  console.log('>> check path public: ', join(__dirname, '..', 'public'));
  console.log('>> check path views: ', join(__dirname, '..', 'views'));
  // config port

  // config security
  app.use(helmet());

  app.enableCors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: 'Content-Type,Authorization,X-Custom-Header',
    // exposedHeaders: 'X-Custom-Header,X-Another-Header',
    // credentials: true,
    preflightContinue: false
  });


  // config tools
  app.use(compression())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'] //v1, v2
  });

  //config cookies
  app.use(cookieParser());
  //config swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS  APIs Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }
  );


  await app.listen(port);

}
bootstrap();
