import nodemailer from'nodemailer'
class MailService{
    constructor(){
        this.transporter= nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_POST,
            secure: true,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to,link){
    await this.transporter.sendMail({
        from:`${process.env.SMTP_USER}`,
        to,
        subject:'Activation account on '+process.env.API_URL,
        text:'',
        html:
        `
        <div>
        <h1>For activation follow this link</h1>
        <a href="${link}">${link}</a>
        </div>
        `
    }, (err, info) => {
        console.log(err,info);
        
    })}
}
export default new MailService()



