import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Time to live for the limit (in seconds)
        limit: 10, // Number of requests allowed in that time frame
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
