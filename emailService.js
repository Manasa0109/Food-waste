require("dotenv").config();

const nodemailer=require("nodemailer");
const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});
async function sendEmail(to,subject,text){
    const mailOptions={
        from:process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail;