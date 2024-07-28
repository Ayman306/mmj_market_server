const nodemailer = require('nodemailer')

class emailUtilityClass {
  public async sendEmail(email: string, body: string): Promise<void> {
    let transporter = nodemailer.createTransport({
      // Configure your email service here
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'cristina.botsford@ethereal.email',
        pass: 'Rdh3kn2pSKXg5QCDX6',
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
