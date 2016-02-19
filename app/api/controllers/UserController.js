/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    login: function (req, res) {
        var bcrypt = require('bcryptjs');
        var params = req.params.all();

        if (req.session.user) {
            res.status(200).json({
                message: 'Already logged in.'
            });
        }

        if (typeof params.username === 'undefined') {
            res.status(403).json({
                message: 'Forbidden - Missing username'
            });
        } else {
            sails.log.verbose('login with username: '+params.username);

            User.findOneByUsername(params.username).exec(function (err, user) {
                if (err) {
                    sails.log.verbose('login with username: '+err);

                    res.status(403).json({
                        message: 'Forbidden - user lookup failed'
                    });
                }

                sails.log.verbose('no user look up error, returned user: '+user);

                if (user) {
                    if(user.isActive === false) {
                        res.status(403).json({
                            message: 'Forbidden - user account is not activated yet !'
                        });
                    } else {
                        sails.log.verbose('found user: '+user);

                        req.session.user = user;
                        req.session.started = new Date();
                        res.json({
                            message: "Welcome! You have been successfully logged in.",
                            "user": user
                        });

                        /**
                        bcrypt.compare(params.password, user.password,
                            function (err, match) {
                                if (err) {
                                    res.status(500).json({
                                        message: 'Internal server error.'+err
                                    });
                                }
                                if (match) {
                                    // password match
                                    req.session.user = user;
                                    req.session.started = new Date();
                                    res.json({
                                        message: "Welcome! You have been successfully logged in.",
                                        "user": user
                                    });
                                } else {
                                    // invalid password
                                    res.status(403).json({
                                        message: 'Forbidden - invalid password'
                                    });
                                }
                            });
                         **/
                    }
                } else {
                    res.status(403).json({
                        message: 'Forbidden - user not found'
                    });
                }
            });
        }
    },

    isLoggedIn: function (req, res) {
        if (typeof req.session.user !== 'undefined' || (req.session.user && typeof req.session.user.id !== 'undefined')) {
            User.findOne(req.session.user.id).exec(function (err, user) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        msg: 'Server error, please contact an administrator.'
                    });
                } else {
                    if (typeof user === 'undefined') {
                        res.status(404).json({
                            success: false, msg: 'User not found.'
                        });
                    } else {
                        res.status(200).json({
                            loggedIn: true, user: user, session: req.session
                        });
                    }
                }
            });
        } else {
            res.status(200).json({
                loggedIn: false, msg: 'Session expired or does not exist.'
            });
        }
    },

    logout: function (req, res) {
        req.session.destroy();

        res.status(200).json({
            success: true, msg: 'Session destroyed successfully.'
        });
    },
    sendEmailToken: function (req, res) {
        var uuid = require('uuid');
        var params = req.params.all();

        if (req.session.user) {
            res.status(403).json({
                message: 'Forbidden - User already logged in.'
            });
        }

        if (typeof params.email === 'undefined' || typeof params.type === 'undefined') {
            res.status(403).json({
                message: 'Forbidden - Missing email !'
            });
        } else {

            User.findOneByEmail(params.email).exec(function (err, user) {
                if (err) {
                    res.status(403).json({
                        message: 'Forbidden - email lookup failed !'
                    });
                }

                if (user) {
                    //send reset password
                    if(params.type === 'password') {
                        if(user.isActive) {
                            //generate new token and send email
                            user.emailToken = uuid.v4();
                            user.save(function(err, usr) { 
                                console.log(usr);
                                console.log(user);
                                if (err) {
                                    res.status(403).json({
                                        message: 'Forbidden - An error occured while generating a key for your request !'
                                    });
                                }

                                //send email
                                MailerService.send({
                                  to: params.email,
                                  subject: "[FPDS] Reset Password",
                                  body: "Please click on this <a href='"+sails.getBaseurl()+"/#/reset-password?token="+user.emailToken+"'>link</a> to reset your password !"
                                }, //success
                                function(){
                                    res.json({
                                        message: "email An email has been sent to this email address for resetting your password !",
                                        token: user.emailToken
                                    });
                                }, //error
                                function(){
                                    res.status(403).json({
                                        message: 'Forbidden - An error occured while generating a key for your request !'
                                    });
                                });
                            });
                        } else {
                            res.status(403).json({
                                message: "Your account is not activated yet ! Please activate your account in order to reset your password.",
                            });
                        }
                    }
                    //send activation email
                    else if(params.type === 'activation') {
                        if(!user.isActive) {
                            //generate new token and send email
                            user.emailToken = uuid.v4();
                            user.save(function(err, usr) { 
                                console.log(usr);
                                console.log(user);
                                if (err) {
                                    res.status(403).json({
                                        message: 'Forbidden - An error occured while generating a key for your request !'
                                    });
                                }

                                //send email
                                MailerService.send({
                                  to: params.email,
                                  subject: "[FPDS] Account Activation !",
                                  body: "Please click on this <a href='"+sails.getBaseurl()+"/#/?token="+user.emailToken+"'>link</a> to activate your account !"
                                }, //success
                                function(){
                                    res.json({
                                        message: "The activation link has been sent to your email address ! !",
                                        token: user.emailToken
                                    });
                                }, //error
                                function(){
                                    res.status(403).json({
                                        message: 'Forbidden - An error occured while generating a key for your request !'
                                    });
                                });
                            });
                        } else {
                            res.status(403).json({
                                message: "Your account is already activated !",
                            });
                        }
                    }
                } else {
                    res.status(403).json({
                        message: 'Forbidden - email not found !'
                    });
                }
            });
        }
    },
};
