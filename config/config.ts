import dotenv from 'dotenv'
import { z } from "zod";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).describe('Environment'),
  PORT: z.coerce.number().default(3000),
  MONGODB_URL: z.string({
    description: 'MongoDB Connection string',
    required_error: '😱 You forgot to add a database URL',
  }).min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1).describe('Client secret'),
  GOOGLE_CLIENT_ID: z.string().min(1).describe('Client ID'),
  GOOGLE_CALLBACK_URL: z.string().min(1).describe('callback url'),
  JWT_SECRET: z.string().min(1).describe('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(30).describe('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30).describe('days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(10).describe('minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(10).describe('minutes after which verify email token expires'),
  SMTP_HOST: z.string().optional().describe('server that will send the emails'),
  SMTP_PORT: z.coerce.number().optional().describe('port to connect to the email server'),
  SMTP_USERNAME: z.string().optional().describe('username for email server'),
  SMTP_PASSWORD: z.string().optional().describe('password for email server'),
  EMAIL_FROM: z.string().optional().describe('the from field in the emails sent by the app'),
}).catchall(z.unknown());


const result = envSchema.safeParse(process.env)

if (result.error) {
  const errorMessage = result.error.issues.map((issue) => `${issue.path} ${issue.message}`).join("; ")
  throw new Error(`Config validation error: ${errorMessage}`);
}
const envVars = result.data
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  google:{
    clientSecret:envVars.GOOGLE_CLIENT_SECRET as string,  // as for type safety fixs
    clientId:envVars.GOOGLE_CLIENT_ID as string,
    callbackURL:envVars.GOOGLE_CALLBACK_URL as string,
  }
};

export default config;
