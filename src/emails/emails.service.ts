import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string,otp:string) {
    try{
      console.log(`sendWelcomeEmail otp--->`,otp);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to our service',
        template: 'otptemplate', 
        context: {
          name,
          otp,
          email
        },
      });

    }catch(err){
      console.log("email err--->",err)
      throw new HttpException(
        err,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    }

  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all emails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
