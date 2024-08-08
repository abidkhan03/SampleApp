// Importing required modules and packages
import 'source-map-support/register'; // Provides source map support for error stack traces
import 'reflect-metadata'; // Required for TypeORM and other reflection-based libraries
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '@app/modules/main/app.module'; // Main application module
import { setupSwagger } from '@app/swagger'; // Function to setup Swagger documentation
import { TrimStringsPipe } from '@app/modules/common/transformer/trim-strings.pipe'; // Custom pipe to trim strings
import { NestExpressApplication } from '@nestjs/platform-express'; // Platform-specific application
import * as cookieParser from 'cookie-parser'; // Middleware to parse cookies

declare const module: any; // Declaration for module hot reloading

// Define application port
const APP_PORT = 3001;

async function bootstrap() {
  // Create a NestJS application using the NestExpressApplication type
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Setup Swagger for API documentation
  setupSwagger(app);

  // Initialize a logger for the application
  const logger = new Logger('Bootstrap');

  // Use cookie-parser middleware for parsing cookies
  app.use(cookieParser());

  // Set a global prefix for all API routes
  app.setGlobalPrefix('api');

  // Enable Cross-Origin Resource Sharing (CORS) with specific origins
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Allow specific origins
    credentials: true, // Allow cookies to be sent in cross-site requests
  });

  // Use global pipes for validation and transformation
  app.useGlobalPipes(
    new TrimStringsPipe(), // Custom pipe to trim whitespace from string inputs
    new ValidationPipe({ whitelist: true }), // Automatically remove non-whitelisted properties
  );

  // Use global interceptors for serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configure class-validator to use Nest's DI container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Start the application and listen on the specified port
  await app.listen(APP_PORT);
  logger.log("Application running on: " + APP_PORT);

  // Setup module hot-reloading if available
  if (module.hot) {
    module.hot.accept(); // Accept hot module updates
    module.hot.dispose(() => app.close()); // Close the app before disposing
  }
}

// Call the bootstrap function to start the application
bootstrap();
