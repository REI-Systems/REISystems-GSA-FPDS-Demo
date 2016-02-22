/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var uuid = require('uuid');

module.exports = {

  attributes: {
    name: {type: 'string'},
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
        type: 'string', 
        unique: true, 
        required: true
    },
    email: { type: 'email' },
    isActive: { type: 'boolean', defaultsTo: false},
    emailToken: { 
        type: 'string', 
        defaultsTo: function() { 
            return uuid.v4(); 
        } 
    },
    preferences: {type: 'json'},
    savedSearches: {type: 'json'}
  },

  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(attrs.password, salt, function (err, hash) {
        if (err) return next(err);

        attrs.password = hash;

        //send email account activation
        MailerService
        .send({
          to: attrs.email,
          subject: '[FPDS] Account Activation !',
          body: "Please click on this <a href='"+sails.getBaseurl()+"/#/?token="+attrs.emailToken+"'>link</a> to activate your account !"
        },
        function(){ console.log('email sent'); },
        function(err){ console.log(err); });
        next();
      });
    });
  },
  beforeUpdate: function (values, next) {
      if(values.password) {
        var bcrypt = require('bcryptjs');
        bcrypt.genSalt(10, function (err, salt) {
          if (err) return next(err);
          bcrypt.hash(values.password, salt, function (err, hash) {
            if (err) return next(err);

            values.password = hash;
            next();
          });
        });
      } else {
        next();
      }
  }
};

