const mongoose = require('mongoose');

const imgDataSchema = new mongoose.Schema({
  time: {type: String, required: true},
  category: {type: String, required: true},
  title: {type: String, required: true},
  details: {type: String, required: true},
  coordinates: {type: Object, required: true},
  thumbnail: String,
  image: String,
  original: {type: String, required: true},
});

module.exports = mongoose.model('ImgData', imgDataSchema);
