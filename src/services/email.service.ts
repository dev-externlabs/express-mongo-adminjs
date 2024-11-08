import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import config from '#/config';
import logger from '#/logger';

const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server ✨'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


const sendEmail = async (to:string, subject:string, text:string, cc=[]) => {
  const mailDetails: MailOptions = { from: config.email.from, to, subject, text, cc };
  await transport.sendMail(mailDetails);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to:string, token:string): Promise<void> => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.appLink}/reset-password?token=${token}`;

  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to:string, token:string): Promise<void> => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.appLink}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const emailService = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};

export default emailService;
