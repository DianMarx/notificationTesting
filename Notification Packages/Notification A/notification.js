/**
 * @typedef {{}} Notification
 *
 */


/**
 * @param settings {BuzzSettings}
 * @param settings.notification {NotificationSettings}
 * @param settings.email {EmailSettings}
 * @param database
 * @returns {Notification}
 */
module.exports = function (settings, database) {
    var nodemailer = require('nodemailer');

    var mongodb = database.mongoose;
    var Schema = mongodb.Schema;
    var info;
    /**
     * @type {Notification}
     */
    var notification = {};

    var userAddress;//="301emailtest@gmail.com";         //Gmail username eg name before @gmail.com
    var userAddressPassword;//="301testemail";   //Gmail password
    var recipientAddress;//="gontsedau@gmail.com";   //email address of recipient
    var senderAddress;//="301emailtest@gmail.com";  //email address of sender


    var subjectRegistration;
    var messageRegistration;
    var subjectDeregistration;
    var messageDeregistration;
    var subjectNewPost;
    var messageNewPost;
    var subjectDeletedThread;
    var messageDeletedThread;
    var subjectMovedThread;
    var messageMovedThread;
    var subjectNewAppraisal;
    var messageNewAppraisal;

   // var notifications_Thread;

    var dataset = mongodb.model('Notifications_Thread', new Schema({
        notification_Following: Boolean,
        notification_StudentID: String,
        notification_ThreadID: String,
        notification_userID: String
    }), 'Notifications_Thread');

    var appraisals = mongodb.model('Notifications_Appraisal', new Schema({
        notification_StudentID: String,
        notification_AppraisalType: String,
        notification_ThreadID: String
    }), 'Notifications_Appraisal');

  /*   var userSchema = mongodb.model('Notifications_Users', new Schema({
        notification_userID: String
    }), 'Notifications_Users');

*/
    /*
     var email = mongodb.model('Students', new Schema({
     std_Name: String,
     std_Surname: String,
     std_Email: String
     }), 'Students');*/
    notifications_Thread = dataset;
    /**
     * Self calling function to initialize once.
     */
    (function init() {

        userAddress = settings.email.address;
        userAddressPassword = settings.email.password;
        senderAddress = settings.email.address;

        subjectRegistration = settings.notification.subjectRegistration;//datas[7];
        messageRegistration = settings.notification.messageRegistration;//datas[9];
        subjectDeregistration = settings.notification.subjectDeregistration;//datas[11];
        messageDeregistration = settings.notification.messageDeregistration;//datas[13];
        subjectNewPost = settings.notification.subjectNewPost;//datas[15];
        messageNewPost = settings.notification.messageNewPost;//datas[17];
        subjectDeletedThread = settings.notification.subjectDeletedThread; //datas[19];
        messageDeletedThread = settings.notification.messageDeletedThread; //datas[21];
        subjectMovedThread = settings.notification.subjectMovedThread; //datas[23];
        messageMovedThread = settings.notification.messageMovedThread;//datas[25];
        subjectNewAppraisal = settings.notification.subjectNewAppraisal; //datas[27];
        messageNewAppraisal = settings.notification.messageNewAppraisal; //datas[29];
    })();

    notification.notifyRegistration = function (jsonObject) {
        //Two tables. For those who follow threads and for those who follow users.
        if (jsonObject.type == "follow_Thread") {

            /*   var notifications_Thread = mongodb.model('Notifications_Thread', new Schema({
             notification_Following: Boolean,
             notification_ThreadID: String,
             notification_StudentID: String
             }, {versionKey: false}), 'Notifications_Thread');*/

            new notifications_Thread({
                notification_Following: true,
                notification_ThreadID: jsonObject.threadID,
                notification_StudentID: jsonObject.studentID
            }).save(function (err, doc) {
                    if (err != null)
                        console.log(err);
                    else {
                        console.log("User has been registered to thread notifications - " + doc);
                        return true;
                    }
                    //process.exit();
                });
        }
        else if (jsonObject.type == "follow_User") {
            var notification_Users = mongodb.model('Notification_Users', new Schema({
                notification_Following: Boolean,
                notification_userID: String,
                notification_StudentID: String
            }, {versionKey: false}), 'Notification_Users');

            new notification_Users({
                notification_Following: true,
                notification_userID: jsonObject.userID,
                notification_StudentID: jsonObject.studentID
            }).save(function (err, doc) {
                    if (err != null)
                        console.log(err);
                    else
                        console.log("User has been registered to user notifications - " + doc);
                });
        }

        return true;
    };

    notification.notifyDeregistration = function (jsonObject) {
        //Two tables. For those who follow threads and for those who follow users.
        if (jsonObject.type == "deregister_Thread") {
            /*  var notifications_Thread = mongodb.model('Notifications_Thread', new Schema({
             notification_StudentID: String
             }), 'Notifications_Thread');*/
            dataset.remove({
                notification_StudentID: jsonObject.studentID,
                notification_ThreadID: jsonObject.threadID
            }, function (err) {
                if (err != null)
                    console.log(err);
                else
                    console.log("user has been removed from table");
            });
        }
        else if (jsonObject.type == "deregister_User") { //notifications_Thread
            var notification_Users = mongodb.model('Notification_Users', new Schema({
                notification_StudentID: String
            }), 'Notification_Users');
            notification_Users.remove({notification_StudentID: jsonObject.studentID}, function (err) {
                if (err != null)
                    console.log(err);
                else
                    console.log("user has been removed from table");
            });
        }


        return true;
    };

    notification.notifyNewPost = function (jsonObject) {
        //Querying database to find user(s) who need to be sent emails.
        //Assuming threadID of thread which has been updated will be received in jsonObj
        //Query database to find user(s) who are subscribed to the thread and send email to each
        /*var dataset = mongodb.model('Notifications_Thread', new Schema({
         notification_Following: Boolean,
         notification_StudentID: String
         }), 'Notifications_Thread');*/
        dataset.find({'notification_ThreadID': jsonObject.threadID}, function (err, data) {

            if (err == null) {
                info = data;
                console.log("User has been registered to get new post notifications - "+ info);
                /*var email = mongodb.model('Students', new Schema({
                 std_Name: String,
                 std_Surname: String,
                 std_Email: String
                 }), 'Students2');*/

                //Iterate through the results returned to get the student's details (Email, Name, Surname)
                //And send the notification email
                /*for(var i = 0; i < info.length; i++)
                 {
                 email.findOne({std_StudentNumber : info[i].notification_StudentID}, function(err, data){
                 if(err != null)
                 {
                 console.log(data);
                 }
                 else
                 {
                 //Assign recipient address here from results of query
                 recipientAddress = data.std_Email;
                 sendNotification(userAddress, userAddressPassword, senderAddress, recipientAddress, mailSubject, mailMessage);
                 }
                 });
                 }*/
            }
            else {
                console.log("Not found in database.");
                return false;
            }
        });

        return true;
    };

    notification.notifyDeletedThread = function (jsonObject) {
        //Querying database to find user(s) who need to be sent emails.
        //Assuming threadID of thread which has been updated will be received in jsonObj
        //Query database to find user(s) who are subscribed to the thread and send email to each
        /*  var dataset = mongodb.model('Notifications_Thread', new Schema({
         notification_Following: Boolean,
         notification_StudentID: String
         }), 'Notifications_Thread');*/
        dataset.find({'notification_ThreadID': jsonObject.threadID}, function (err, data) {

            if (err == null) {
                info = data;
                console.log("User has been registered to get deleted notifications - "+ info);
                /*  var email = mongodb.model('Students', new Schema({
                 std_Name: String,
                 std_Surname: String,
                 std_Email: String
                 }), 'Students3');*/

                //Iterate through the results returned to get the student's details (Email, Name, Surname)
                //And send the notification email
                /*for(var i = 0; i < info.length; i++)
                 {
                 email.findOne({std_StudentNumber : info[i].notification_StudentID}, function(err, data){
                 if(err == null)
                 {
                 console.log(err);
                 }
                 else
                 {
                 //Assign recipient address here from results of query
                 recipientAddress = data.std_Email;
                 sendNotification(userAddress, userAddressPassword, senderAddress, recipientAddress, mailSubject, mailMessage);
                 }
                 });
                 }*/
            }
            else {
                console.log("Not found in database.");
                return false;
            }
        });
        return true;
    };

    notification.notifyMovedThread = function (jsonObject) {
        //Querying database to find user(s) who need to be sent emails.
        //Assuming threadID of thread which has been updated will be received in jsonObj
        //Query database to find user(s) who are subscribed to the thread and send email to each
        /*var dataset = mongodb.model('Notifications_Thread', new Schema({
         notification_Following: Boolean,
         notification_StudentID: String
         }), 'Notifications_Thread');*/
        dataset.find({'notification_ThreadID': jsonObject.threadID}, function (err, data) {

            if (err == null) {
                info = data;
                console.log("User has been registered to get moved thread notifications - "+info);
                /*   var email = mongodb.model('Students', new Schema({
                 std_Name: String,
                 std_Surname: String,
                 std_Email: String
                 }), 'Students4');*/

                //Iterate through the results returned to get the student's details (Email, Name, Surname)
                //And send the notification email
                /*for(var i = 0; i < info.length; i++)
                 {
                 email.findOne({std_StudentNumber : info[i].notification_StudentID}, function(err, data){
                 if(err == null)
                 {
                 console.log(err);
                 }
                 else
                 {
                 //Assign recipient address here from results of query
                 recipientAddress = data.std_Email;
                 sendNotification(userAddress, userAddressPassword, senderAddress, recipientAddress, mailSubject, mailMessage);
                 }
                 });
                 }*/
            }
            else {
                console.log("Not found in database.");
                return false;
            }
        });
        return true;
    };

    notification.appraisalRegister = function (jsonObj) {

        new appraisals({
            notification_StudentID: jsonObj.studentID,
            notification_AppraisalType: jsonObj.appraisalType
        }).save(function (err, doc) {
                if (err != null)
                    console.log(err);
                else
                    console.log("User has been registered to appraisal notifications - " + doc);
            });
    };

    notification.appraisalDeregister = function (jsonObj) {
        appraisals.remove({
            notification_StudentID: jsonObj.studentID,
            notification_AppraisalType: jsonObj.appraisalType
        }, function (err) {
            if (err != null)
                console.log(err);
            else
                console.log("user has been removed from table");
        });
    };

    /* User should be sent an email if they are registered for that particular appraisal type
     * If the user is not registered for any Appraisal type, user is sent an email for all appraisal types
     */
    notification.appraisalNotify = function (jsonObj) {


        //Query database to see if user is registered for particular appraisal type
        appraisals.find({notification_StudentID: jsonObj.studentID}, function (err, data) {
            if (err != null) {
                console.log(err);
            }
            else {
                var info = data;
                //If info is NOT NULL, then the user is registered for some appraisal type
                if (info != null) {
                    //Iterate through the all the appraisal types user is registered for
                    //to see if they are registered for the current appraisal type
                    //If they are, send email notification
                    //If not, return
                    for (var i = 0; i < info.length; i++) {
                        if (info[i].notification_AppraisalType == jsonObj.appraisalType) {
                            send();
                            break;
                        }
                    }
                }
                else {
                    //If info IS NULL, then the user is not registered for any appraisal type
                    //By default user should receive notification for ALL appraisal types
                    send();
                }
            }
        });

        //Send the email
        function send() {
            var email = mongodb.model('Students', new Schema({
                std_Name: String,
                std_Surname: String,
                std_Email: String
            }), 'Students5');

            email.findOne({std_StudentNumber: jsonObj.studentID}, function (err, data) {
                if (err != null) {
                    console.log(err);
                }
                else {
                    //Assign recipient address here from results of query
                    recipientAddress = data.std_Email;
                    console.log(recipientAddress);
                    //sendNotification(userAddress, userAddressPassword, senderAddress, recipientAddress, subjectNewAppraisal, messageNewAppraisal);
                }
            });
        }
    };

    //Function to send email list to specified recipient
    notification.sendNotification = function (recipient, inNotificationType, inMessage) {

        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: userAddress,
                pass: userAddressPassword
            }
        });

        smtpTransport.sendMail({
                from: senderAddress,
                to: recipient,
                subject: inNotificationType,
                text: inMessage,  //Messages to send
                html: '<head><title>' + inNotificationType + '</title></head><body>Good day ' + recipient + ',<br><br>' + inMessage + '<br><br>Thank you,<br><br>The Buzz System</body>'

            },
            function (error, response) {
                if (error) {
                    console.log(error);
                    return false;
                }
                else {
                    console.log("Message sent " );
                    return true;
                }
            });
    };

    return notification;
};

module.exports['@require'] = ['buzz-settings', 'buzz-database'];
module.exports['@singleton'] = true;
