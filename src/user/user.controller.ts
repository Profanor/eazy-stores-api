import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateAdminUserDto } from './dto/create-admin.dto';

@ApiTags('User')
@Controller({
  version: '1',
  path: 'auth',
})
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // create a regular user
  @Post('/signup/user')
  create(@Body() createUserDto: CreateUserDto) {
    // Ensure no admin-specific fields are present for regular users
    if (createUserDto.isAdmin || createUserDto.adminKey) {
      throw new UnauthorizedException(
        'Regular users cannot provide isAdmin or adminKey',
      );
    }
    return this.userService.createUser(createUserDto);
  }

  // create an admin
  @Post('/signup/admin')
  adminSignup(@Body() createAdminDto: CreateAdminUserDto) {
    return this.userService.createAdminUser(createAdminDto);
  }

  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
