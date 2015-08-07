///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var TagSchema = require('../../db/schemas/tag');

module.exports = mongoose.model('Tag',TagSchema);