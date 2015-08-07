"use strict";

let mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username:{type:String},
    password:{type:String}
});

UserSchema.statics = {

	findByName: function(name, cb) {
		return this.findOne({ account: name }, cb);
	}

};

module.exports = UserSchema;


