var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
	artist: String,
	title: String,
	length: Number,
	isFavorite: Boolean,
	genres: [String] 
});

songSchema.methods.getLength = function() {
	var minutes = Math.floor(this.length/60);
	var seconds = this.length % minutes || this.length;
	return minutes + ' m ' + seconds + ' sec';
};

var Song = mongoose.model('Song', songSchema);

module.exports = Song;