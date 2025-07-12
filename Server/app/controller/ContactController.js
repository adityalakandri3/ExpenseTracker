const transporter = require("../config/emailConfig");

class ContactController {
  async contact(req, res) {
    try {
      const { name, email, subject, message } = req.body;
      if ((!name, !email, !subject, !message)) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
        });
      }
      // console.log("sending to:",process.env.EMAIL_USER)
      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Contact Form:${subject}`,
        html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              `,
      });
      return res.status(200).json({
        status:true,
        message:"Message Sent Successfully."
      })
    } catch (error) {
        return res.status(400).json({
            status:false,
            message:`Something went wrong. ${error.message}.`
          })
    }
  }
}

module.exports = new ContactController;
