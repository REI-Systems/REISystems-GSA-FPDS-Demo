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
    }
};
