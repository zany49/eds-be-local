import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailsModule } from 'src/emails/emails.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  imports:[
    JwtModule.register({
      secret: process.env.SEC_KEY, // Use a secure key in production
      signOptions: { expiresIn: '8h' }, // Token expiration time
    }),
    PrismaModule,
    EmailsModule,

  ]
})
export class UserModule {}
