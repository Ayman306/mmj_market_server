const nodemailer = require('nodemailer')

class emailUtilityClass {
  public async sendEmail(data: any): Promise<void> {
    let transporter = nodemailer.createTransport({
      // Configure your email service here
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    })

    await transporter.sendMail({
      from: 'aymanuddin1111.au@gmail.com',
      to: data.email,
      subject: data.subject,
      html: data.body,
    })
    //   }
  }
}
export const emailUtility = new emailUtilityClass()
