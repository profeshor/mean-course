const { stringify } = require('@angular/compiler/src/util');
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: { type: String, required: true},
  imagePath: { type: String, required: true},
  creator: {type: mongoose.Types.ObjectId, ref:"User" , required:true}
});

module.exports = mongoose.model('Post', postSchema)
