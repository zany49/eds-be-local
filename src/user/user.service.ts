import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, Prisma,User } from '@prisma/client'

// const prisma = new PrismaClient()
@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){
    }

  async create(data: Prisma.UserCreateInput): Promise<User>  {
    return  await this.prisma.user.create({
      data,
    })
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
