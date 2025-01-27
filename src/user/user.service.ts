import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { ValidateUserDto } from './dto/validate-user.dto';
import { ConfigService } from '@nestjs/config';
import { CreateAdminUserDto } from './dto/create-admin.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // create regular user
  async createUser(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: false,
      },
    });
    return createdUser;
  }

  // create admin user
  async createAdminUser(createAdminDto: CreateAdminUserDto) {
    const { username, password, adminKey } = createAdminDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    if (
      !adminKey ||
      adminKey !== this.configService.get<string>('ADMIN_SIGNUP_KEY')
    ) {
      throw new UnauthorizedException('Invalid admin key');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdAdmin = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin: true,
      },
    });
    return createdAdmin;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: `User with ID ${userId} deleted successfully` };
  }
}
