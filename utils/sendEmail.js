//import { createTransport } from "nodemailer";
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "b17f3b91183f72",
            pass: "f3ec0c226a4508"
        }
    });

    /*onst transporter = createTransport(
        {
            host: "sandbox.smtp.mailtrap.io", //process.env.SMTP_HOST,
            port: 2525, //process.env.SMTP_PORT,

            auth: {
                user: "b17f3b91183f72", //rocess.env.SMTP_USER,
                pass: "********4508", //process.env.SMTP_PASS,
            }
        }
    );*/


    await transport.sendMail({
        to,
        subject,
        text,
    })
};