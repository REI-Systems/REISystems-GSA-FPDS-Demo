// api/services/MailerService.js

var directConfig = {
    name: 'fpds.local', // must be the same that can be reverse resolved by DNS for your IP
    port: 25,
    direct: true
};

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(directConfig);

module.exports = {
    send: function(oOption, callBackFnSuccess, callBackFnError) {
        transporter.sendMail({
            from: 'no-reply@fpds.local',
            to: oOption.to,
            subject: oOption.subject,
            html: oOption.body
        },
        function(err, info) {
          if(err) { 
                console.log(err); 

                if(typeof callBackFnError === 'function') {
                    callBackFnError();
                }
            } else {
                if(typeof callBackFnSuccess === 'function') {
                    callBackFnSuccess();
                }
            }
        });
    }
};