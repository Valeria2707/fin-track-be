import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAILJET_API_KEY,
      pass: process.env.MAILJET_SECRET_KEY,
    },
  });

  async sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Finance Tracker" <zavadetska.valeria@lll.kpi.ua>',
      to,
      subject: 'Password Reset',
      html: `
        <p>Hello ${name || ''},</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }
}
