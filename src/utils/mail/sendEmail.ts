import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

export const sendEmail = async(email: string) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtppro.zoho.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
    
        const weeklyInvoiceEmail = {
            from: `Members @ 3wb.club <${process.env.USER}>`,
            to: email, // Dynamic recipient email address
            subject: 'weekly member dues=',
            html: `
                <p>Hi,</p>

                <p>Your weekly club membership is due. Kindly pay early and boost your rankings</p>

                <p>Warm regards,<br/>3wb.club</p>
            `,
        };
        await transporter.sendMail(weeklyInvoiceEmail);
    } catch (error) {
        console.log(error)
    }

}



