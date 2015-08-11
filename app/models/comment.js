///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var CommentSchema = require('../../db/schemas/comment');

module.exports = mongoose.model('Comment',CommentSchema);