const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to: email,
        from: "utkarshlath1@gmail.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let us know how to get along with the app.`
    })
}

const sendCancellationMail = (email,name)=>{
    sgMail.send({
        to: email,
        from: "utkarshlath1@gmail.com",
        subject: "Sorry to see you go!",
        text: `Goodbye, ${name}! Hope to hear from you soon.`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancellationMail
}