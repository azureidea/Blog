"use strict";

let mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email:{type:String},
    password:{type:String}
});

UserSchema.statics = {

	findByName: function(name, cb) {
		return this.findOne({ email: name }, cb);
	}

};

module.exports = UserSchema;


