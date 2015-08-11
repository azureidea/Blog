///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var UserSchema = require('../../db/schemas/user');

module.exports = mongoose.model('User',UserSchema);