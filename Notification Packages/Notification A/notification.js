
//For database access
var db = require('database');
var mongodb = db.mongoose;
var Schema = mongodb.Schema;

//For Email functionality
var nodemailer = require('nodemailer');

var userAddress="";         //Gmail username eg name before @gmail.com
var userAddressPassword="";   //Gmail password
var recipientAddress="";   //email address of recipient
var senderAddress="";  //email address of sender
var mailSubject=""; //Notification subject
var mailMessage="";//Message to be sent

/*
 *The parameter will contain the relavent information such as
 *Type: 'Register', 'Deregister', 'Post', 'Delete'.
 *StudentID: The student ID of the user that generated this request.
 *ThreadID: The ID of the thread that was acted upon.
 * OR
 * StudentID of the user to follow.
 */
var notify = function(jsonObject)
{
    //Connect to the database
    mongodb.connect('mongodb://45.55.154.156:27017/Buzz');
    mongodb.connection.on('error', function (err) {
        // Do something
        console.log("error: cant connect");
        return;
    });

    //Querying database to find user(s) who need to be sent emails.
    //Assuming threadID of thread which has been updated will be received in jsonObj
    //Query database to find user(s) who are subscribed to the thread and send email to each

    var questions = mongodb.model('Notifications_Thread', new Schema({notification_Following : Boolean, notification_StudentID : String}), 'Notifications_Thread');
    questions.find({'notification_ThreadID' : '0'}, function (err, data) {

        if (err == null) {
            info = data;
            console.log(info);
            var email = mongodb.model('Students', new Schema({std_Name : String, std_Surname : String, std_Email : String}), 'Students');

            //Iterate through the results returned to get the student's details (Email, Name, Surname)
            //And send the notification email
            for(var i = 0; i < info.length; i++){
                email.findOne({std_StudentNumber : info[i].notification_StudentID}, function(err, data){
                    console.log(data);

                    //Assign recipient address here from results of query
                    //recipientAddress = data.std_Email;
                    sendNotification(userAddress, userAddressPassword, senderAddress, recipientAddress, mailSubject, mailMessage);
                });
            }
        }
        else {
            console.log("Not found in database.")
        }
    });
}

//Function to send email list to specified recipient
function sendNotification(inUser, inPassword, inSender, inRecipient, inNotificationType, inMessage) {

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: inUser,
            pass: inPassword
        }
    });

    transporter.sendMail({
        from: inSender,
        to: inRecipient,
        subject: inNotificationType,
        text: inMessage  //Messages to send
    });
    console.log('Message sent.');
}

module.exports.notify = notify;
module.exports.sendNotification=sendNotification;
