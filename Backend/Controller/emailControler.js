const nodemailer = require('nodemailer');

exports.sendWelcomeMail = async (name,email,password)=>{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.MYEMAIL,
            pass : process.env.APPPASSWORD
        }
    });
    const mailOptions = {
        from : process.env.MYEMAIL,
        to : email,
        subject : "Welcome to DEMO_PROJECT",
        text: `Welcome! MR/MRS ${name}, we are very greateful because now you are on our platform! You are registered sucessfuly, Your password is ${password} . Don't share it with anyone, THANKS FOR JOINING US !!`
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    }catch(e){
        console.log("Email not sent! ",e);
    }
}