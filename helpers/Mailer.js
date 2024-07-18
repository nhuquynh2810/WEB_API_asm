const nodemailer = require('nodemailer');
//quinntnq@gmail.com
//mhjj lldz cmop vuxf

//khai báo transporter
const transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'quinntnq@gmail.com',
        pass: 'mhjj lldz cmop vuxf'
    },
});
const sendMail = async (data) => {
    try {
        const { email, subject, content } = data;
        const mailOptions = {
            from: 'quinntnq@gmail.com',
            to: email,
            subject,
            html: content,
        };
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        throw new Error('Có lỗi xảy ra khi gửi email');
    }
}


module.exports = {
    sendMail,
}