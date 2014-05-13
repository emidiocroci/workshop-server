var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema(
    {
        text: String,
        author: String,
        date: Date
    });

module.exports = mongoose.model('Post', postSchema);
