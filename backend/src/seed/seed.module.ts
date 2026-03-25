import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Category } from '../database/entities/category.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
