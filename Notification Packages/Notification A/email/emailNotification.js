var nodemailer = require('nodemailer');

var user="johndoe";         //Gmail username eg name before @gmail.com
var password="password";   //Gmail password

var recipient="example@tuks.co.za";   //email address of recipient
var sender="john";  //email address os sender

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
   
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
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
            text: inMessage[i]  //Messages to send
        });
        console.log('Done');
    }
}
//TEST FUNCTION CALL
sendNotification(user,password,sender,recipient,notificationType,emails);