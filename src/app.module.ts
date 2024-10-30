import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailsModule } from './emails/emails.module';
import { PasswordServiceService } from './password-service/password-service.service';
import { CustomerModule } from './customer/customer.module';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT), 
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
            ciphers:'SSLv3'
        }
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, './templates'),  // Path to Pug templates folder
        adapter: new PugAdapter({  inlineCssEnabled: true,}),
        options: {
          strict: true,
        },
      },
    }),
    PrismaModule, 
    UserModule, 
    EmailsModule, CustomerModule
  ],
  controllers: [AppController],
  providers: [AppService, PasswordServiceService],
})
export class AppModule {}
