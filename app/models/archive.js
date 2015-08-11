///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var ArchiveSchema = require('../../db/schemas/archive');

module.exports = mongoose.model('Archive',ArchiveSchema);