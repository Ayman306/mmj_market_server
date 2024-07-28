const nodemailer = require('nodemailer')

class emailUtilityClass {
  public async sendEmail(email: string, body: string): Promise<void> {
    let transporter = nodemailer.createTransport({
      // Configure your email service here
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    })

    await transporter.sendMail({
      from: 'nmayaan306.au@gmail.com',
      to: email,
      subject: 'Your New Account Password',
      html: body,
    })
    //   }
  }
}
export const emailUtility = new emailUtilityClass()
