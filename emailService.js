const nodemailer=require("nodemailer");
const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user:"manasapuligadda9@gmail.com",
        pass:"yxnu joum gngk bpag",
    },
});
async function sendEmail(to,subject,text){
    const mailOptions={
        from:"manasapuligadda9@gmal.com",
        to,
        subject,
        text,
    };
    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail;