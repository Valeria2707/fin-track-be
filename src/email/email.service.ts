import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { basename as fileBaseName } from 'path';
import { formatDate, getMonthRange } from 'src/utils/date';

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
      from: `"Finance Tracker" <${process.env.FROM_EMAIL}>`,
      to,
      subject: 'Password Reset',
      html: `
        <p>Hello ${name || ''},</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendEmailWithAttachment(to: string, attachmentPath: string, filenameOverride?: string): Promise<void> {
    const { fromDate, toDate } = getMonthRange(-1);

    await this.transporter.sendMail({
      from: `"Finance Tracker" <${process.env.FROM_EMAIL}>`,
      to,
      subject: 'Your Monthly Financial Report',
      html: `
      <p>Attached is your report for the period from
         <strong>${formatDate(fromDate)}</strong> to
         <strong>${formatDate(toDate)}</strong>.</p>`,
      attachments: [
        {
          filename: filenameOverride ?? fileBaseName(attachmentPath),
          path: attachmentPath,
        },
      ],
    });
  }
}
