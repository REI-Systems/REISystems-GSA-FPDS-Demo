/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
*/

module.exports = {
    
    attributes: {
        name : { type: 'string' },
        username : { 
            type: 'string',
            unique: true,
            required: true
        },
        password : { type: 'string' },
        email : { type: 'email' },
        preferences: {type: 'json'},
        savedSearches: {type: 'json'},
    },
    beforeCreate: function (attrs, next) 
    {
        var bcrypt = require('bcrypt');
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(attrs.password, salt, function(err, hash) {
                if (err) return next(err);

                attrs.password = hash;
                next();
            });
        });
    }
};

