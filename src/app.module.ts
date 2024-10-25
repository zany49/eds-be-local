import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailsModule } from './emails/emails.module';


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
    EmailsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
