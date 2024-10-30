import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangePassDto, CreateUserDto, UserEmailDto, UserOtpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, Prisma,User } from '@prisma/client'
import { EmailsService } from 'src/emails/emails.service';
import { generateOTP } from 'src/utlis/otp.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PasswordServiceService } from '../password-service/password-service.service';


// const prisma = new PrismaClient()
@Injectable()
export class UserService {
  private readonly saltRounds = 10;

    constructor(
      private prisma: PrismaService,
      private readonly emailService: EmailsService,
      private jwtService: JwtService,
      private passwordService: PasswordServiceService
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
    if(data.role === 'CUSTOMER'||data.role === 'USER'){
      return  await this.prisma.user.create({
        data:{
          ...data,
        },
      })
    }
     let saltpass = await  this.passwordService.hashPassword(data.password)
      return  await this.prisma.user.create({
        data:{
          ...data,
          password: saltpass
        },
      })
  }

  async login(data:Prisma.UserWhereUniqueInput) {
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

  async loginPassword(data:Prisma.UserWhereUniqueInput,paramspassword:string) {
    try{
      const existingUser = await this.prisma.user.findUnique({
        where: {
          phone: data.phone,
        },
      })
      console.log("eist---->", existingUser)
      if(existingUser){
        let comparePass = await  this.passwordService.comparePasswords(paramspassword,existingUser.password)
        console.log("comparePass", comparePass)
        if(comparePass === true){
          const token = this.jwtService.sign({ email: existingUser.email, id: existingUser.id, role: existingUser.role, phone: existingUser.phone});
          return { 
            access_token: token,
            message: 'Password verification successful'
          };
        }else{
          throw new HttpException(
            'Password verification failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
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
  
  async otpcheck(data:UserOtpDto,checkType:string) {
    try{
      console.log("in 1",data)

      var existingUser;
      var  getOtp
      if(checkType === 'email'){
      console.log("in e",data)

        if( !data.email){
          throw new HttpException(
            'Email needed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }else if(data.phone){
          throw new HttpException(
            'Phone Number not needed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
       existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      })
      getOtp = await this.prisma.otp.findFirst({
        where: {
          userId: existingUser.id,
          otpType: 'EMAIL'
        },
      })
    }else if(checkType === 'mobile'){
      console.log("in",data)
      if( !data.phone){
        throw new HttpException(
          'Phone needed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }else if(data.email){
        throw new HttpException(
          'Email not needed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      existingUser = await this.prisma.user.findUnique({
        where: {
          phone: data.phone,
        },
      })
       getOtp = await this.prisma.otp.findFirst({
        where: {
          userId: existingUser.id,
          otpType: 'MOBILE'
        },
        orderBy: { createdAt: 'desc' },
      })
    }
      console.log("eist---->", existingUser,getOtp)

      if (getOtp.otp !== data.otp) {
        throw new BadRequestException('OTP Mismatch');
      }else{
        const token = this.jwtService.sign({ 
           email: existingUser.email,
           id: existingUser.id,
           role: existingUser.role, 
           phone: existingUser.phone 
          });
        return { 
          access_token: token,
          message: 'OTP verification successful'
        };
      }
    }catch(err){
      console.log("otp---->",err);
      throw new HttpException(
        err,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  
  }

  async forgetPass(data:Prisma.UserWhereUniqueInput){

    try{
      const existingUser = await this.prisma.user.findUnique({
        where: {
          phone: data.phone,
        },
      })
      console.log("eist---->", existingUser)
      if(existingUser){
        const otp = generateOTP(6);
        console.log("otp---->", otp)
      //  await this.emailService.sendWelcomeEmail(existingUser?.email,existingUser?.name,otp)
      //  const alreadyExist = await this.prisma.otp.findFirst({
      //   where: {
      //     userId: existingUser.id,
      //   },
      // })
      const alreadyExist = await this.prisma.otp.findMany({
        where: {
          userId: existingUser.id,
        },
      })
      const fildata = alreadyExist.filter(d=>{
        if(d.userId === existingUser.id && d.otpType === "MOBILE"){
          return d
        }
      })
      console.log("fildata--->",alreadyExist,existingUser,"fil--->",fildata)

      if(fildata.length > 0 && fildata.length < 5){
        return await this.prisma.otp.create({
          data: {
            userId: existingUser?.id,
            otpType:'MOBILE',
            otpAttempt:fildata.length+1,
            otp,
          },
        })
      }else if(fildata.length === 5 || fildata.length > 5){
        throw new HttpException(
          'You have crossed the sms limit',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }else{
        return await this.prisma.otp.create({
          data: {
            userId: existingUser?.id,
            otpType:'MOBILE',
            otpAttempt:1,
            otp,
          },
        })
      }

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

  async chnagePassword (data:ChangePassDto){
    try{
      if(data.newPass !== data.confrimPass){
        throw new HttpException(
          "Password Is Not Matching Confrim Password",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const existingUser = await this.prisma.user.findUnique({
        where: {
          phone: data.phone,
        },
      })
      console.log("eist---->", existingUser)
      if(existingUser){
        let saltpass = await  this.passwordService.hashPassword(data.newPass)
          await this.prisma.user.update({
          where: {
            phone: data.phone,
          },
          data: {
            password: saltpass,
          },
        })

        return {
          message:"password updated"
        }
    
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

}
