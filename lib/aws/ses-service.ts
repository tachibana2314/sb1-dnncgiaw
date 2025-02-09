import { 
  SendEmailCommand, 
  SendEmailCommandInput 
} from '@aws-sdk/client-ses';
import { sesClient } from './ses-client';
import { getConfirmationEmailTemplate } from '../email-templates/confirmation';

export class SESService {
  static async sendConfirmationEmail(to: string, name: string) {
    const template = getConfirmationEmailTemplate(name);
    
    const params: SendEmailCommandInput = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: template.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: template.text,
            Charset: 'UTF-8',
          },
          Html: {
            Data: template.html,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await sesClient.send(command);
      console.log('Email sent successfully:', response.MessageId);
      return response;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  // 他のメール送信メソッドもここに追加可能
  // 例：お知らせメール、リマインダーメールなど
} 