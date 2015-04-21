var nodemailer = require('nodemailer');

var user="support@cs.up.ac.za";         //cs support user
var password="pass";   //support password
var recipient="u13057937@tuks.co.za";   //email address of recipient
var sender="Buzz space sender";  //email address os sender

var notificationType="Notification from Buzz!"; //Notification subject

// list of notifications to send
//THIS IS FOR TESTING
var emails = [];
emails.push("test1");
emails.push("test2");
emails.push("test3");


//Function to send email list to specified recipient
function sendNotification(inUser, inPassword, inSender, inRecipient, inNotificationType, inMessage)
{
   
        var transporter = nodemailer.createTransport("SMTP",{
            host: 'mail.cs.up.ac.za',
            port: 25,
            auth: {
                user: inUser,
                pass: inPassword
            }
        });
 for (var i = 0; i < inMessage.length; i++)
    {
        console.log('created');
        transporter.sendMail({
            from: inSender,
            to: inRecipient,
            subject: inNotificationType,
            text: inMessage[i]
             //Messages to send
        });
        console.log('Done');
    }
}
//TEST FUNCTION CALL
sendNotification(user,password,sender,recipient,notificationType,emails);

