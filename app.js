var express = require('express'),
	handlebars = require('express3-handlebars')
		.create({defaultLayout: 'main'/*, extname: '.hbs'*/}),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	credentials = require('./credentials.js'),
	db = require('./models/db.js'),
	Song = require('./models/songSchema.js'),


	app = express();
	//port = process.env.PORT || 3000;

//temp. must placed in db.js
var opts = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};
switch(app.get('env')){
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
	break;
	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString, opts);
	break;
	default:
		throw new Error('Unknown execution environment: ' + app.get('env'));
}
//end

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

Song.find(function(err, songs) {
	if(songs.length) return;

	new Song({
		artist: 'Bob Marley',
		title: 'Bad boys',
		length: 320,
		isFavorite: true,
		genres: ['reggae']
	}).save(),

	new Song({
		artist: 'Mies Davis',
		title: 'Human Nature',
		length: 480,
		isFavorite: false,
		genres: ['jazz']
	}).save()
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// switch (app.get('env')) {
//     case 'development':
//         app.use(morgan('dev'));
//         break;
//     case 'production':
//         app.use(expressLogger({
//             path: path.join(__dirname, '/log/requests.log')
//         }));
//         break;
// }

app.listen(app.get('port'), function(){
	console.log('Server Started');
});

app.get('/', function(req, res) {
	res.type('text/plain');
	res.send('Intresting Test Page');
});

app.get('/about', function(req, res) {
	res.type('text/html');
	res.send("<div style='color: red' id = 'about'>Intresting Test Page</div>");
});

app.get('/about/contact', function(req, res) {
	res.type('text/plain');
	res.send('Contacts');
});

app.get('/start', function(req, res) {
	res.render('startPage');
});

app.get('/songs', function(req, res) {
	Song.find({isFavorite: true}, function(err, songs) {
		var context = {
			songs: songs && songs.map(function(song) {
				return {
					artist: song.artist,
					title: song.title,
					length: song.getLength(),
					genres: song.genres
				}
			})
		};
		res.render('songs', context);
	});
});

app.post('/add-song', function(req, res) {
	new Song({
		artist: req.body.artist || 'no',
		title: req.body.title || 'no',
		length: 320,
		isFavorite: true,
		genres: ['reggae']
	}).save(function() {
		return res.redirect(303, '/songs');
	});
});

app.use(function(req, res, next) {
	var time = new Date().toString();
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.time = {currentTime: time};
	next();
});

app.use(function(req, res, next) {
	res.type('text/html');
	res.status(404);
	res.send("<div style='color: green' id = 'about'>404 - Not Found</div>");
	next();
});
