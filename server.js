const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

// initialize app
var app = express();

// make partials available
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// middleware to keep track of usage and print to log
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});
	console.log(log);
	next();
});

// make maintenance page the only thing you can see
//app.use((req, res, next) => {
//	res.render('maintenance.hbs');
//	next();
//});

// set up directory - middleware
app.use(express.static(__dirname + '/public'));

// helper function to make available throughout project
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

// Uppercase helper
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
})

// Home route
app.get('/', (req, res) => {
	//res.send('<h1>Hello Express!</h1>');
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to the home page!'
	});
});

// About route
app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page',
	});
});

// Bad route
app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Bad Request'
	});
});

// Watch for changes on 3000
app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});