import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserEmailDto, UserOtpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, Prisma,User } from '@prisma/client'
import { EmailsService } from 'src/emails/emails.service';
import { generateOTP } from 'src/utlis/otp.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


// const prisma = new PrismaClient()
@Injectable()
export class UserService {

    constructor(
      private prisma: PrismaService,
      private readonly emailService: EmailsService,
      private jwtService: JwtService
    ){
    }

  async create(data: Prisma.UserCreateInput): Promise<User>  {
    console.log("data---->",data.email)
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email Already Exists');

    }
    return  await this.prisma.user.create({
      data,
    })
  }

  async login(data:Prisma.UserCreateInput) {
    try{
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      })
      console.log("eist---->", existingUser)
      if(existingUser){
        const otp = generateOTP(6);
        console.log("otp---->", otp)
       await this.emailService.sendWelcomeEmail(existingUser?.email,existingUser?.name,otp)
       const alreadyExist = await this.prisma.otp.findFirst({
        where: {
          userId: existingUser.id,
        },
      })
      if(alreadyExist){
        await this.prisma.otp.delete({
          where: {
            id: alreadyExist.id,
          },
        })
      }
       return await this.prisma.otp.create({
        data: {
          userId: existingUser?.id,
          otp,
        },
      })
      }else{
        throw new BadRequestException('Email Do Not Exists');
      }
    }catch(err){
      throw new HttpException(
        err,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }


  }

  
  async otpcheck(data:UserOtpDto) {
    try{
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      })

      const getOtp = await this.prisma.otp.findFirst({
        where: {
          userId: existingUser.id,
        },
      })
      console.log("eist---->", existingUser,getOtp)
      if (getOtp.otp !== data.otp) {
        throw new BadRequestException('OTP Mismatch');
      }else{
        const token = this.jwtService.sign({ email: existingUser.email, id: existingUser.id });
        return { 
          access_token: token,
          message: 'OTP verification successful'
        };
      }
    }catch(err){
      throw new HttpException(
        err,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  
  }

}
