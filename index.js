let express = require("express");
let path = require("path");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let nunjucks = require("nunjucks");
// let session = require('express-session');
let fileUpload = require("express-fileupload");

// let config = require("./config/config");
let router = require("./routes/index");
const { serverAdapter } = require("./functions/bullQueue");

let app = express();

app.get("/healthz", function (req, res) {
	console.log("This is a healthz check");
	res.status(200).json({ message: "OK", uptime: process.uptime() });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev')); // normally in dev
// app.use(logger('combined')); // in prod

// or a bit of both
app.use(
	logger(
		`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :: (time: :response-time ms)`
	)
);

// X-USER-TYPE header is used by all the clients to see what user is hitting the request

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// for file uploads
app.use(
	fileUpload({
		// useTempFiles: true,
		// tempFileDir: '/tmp/',
		debug: true,
	})
);

app.use("/admin", serverAdapter.getRouter());

nunjucks.configure("views", {
	autoescape: true,
	express: app,
});

// Add the postgres or the mongoose middleware as well for session management.
// MongoDB backend: https://www.npmjs.com/package/connect-mongodb-session
// Sequelize Backend: https://www.npmjs.com/package/connect-session-sequelize
// Postgres Backend: https://www.npmjs.com/package/connect-pg-simple

// For other options: https://github.com/expressjs/session#compatible-session-stores

// app.use(session({
//   secret: config.sessionKey,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	); // cors header
	res.header("X-Architect", "Sujit M");
	if (req.method == "OPTIONS") {
		// In very simple terms, this is how you handle OPTIONS request in nodejs
		res.header(
			"Access-Control-Allow-Methods",
			"GET, POST, OPTIONS, PUT, DELETE, HEAD"
		);
		res.header("Access-Control-Max-Age", "1728000");
		res.header("Access-Control-Allow-Credentials", "true");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin,Content-Type,Accept,Authorization, X-AUTH-TOKEN, X-USER-TYPE, REQUEST-ID, X-IS-BLOB"
		);
		res.header("Content-Length", "0");
		res.sendStatus(208);
	} else {
		next();
		// Google analytics logging comes here
	}

	//    next();
});

/**
 * 
 * 
var ua = require('universal-analytics'); 


console.log("analytics logging function enabled:  " + 'UA-156010796-2');
app.use(function (req, res, next) {
    next();

    console.log("Hit the analytics middle ware:  " + 'UA-156010796-2');
    var visitor = ua('UA-156010796-2', '6a14abda-6b12-4578-bf66-43c754eaeda9');

    console.log("The url is:  " + req.originalUrl);
    // log this to slack if needed

    // This is for pageview
    visitor.pageview(req.originalUrl, "boilerplate-api.apps.mahavarkars.io", "API", function (err) {

        // This is for event logging.
        // visitor.event("API", "boilerplate-api.apps.mahavarkars.io", req.originalUrl, function (err) {

        if (err) {
            console.log("there is an issue in logging the data");
            console.log(err);
        } else {
            console.log("successfully logged the data");
        }
    });

});


 */
////////////////////////////////////////////////////////////////////////
// Middlewares for the whole application.

// The authentication middleware. This decrypts the tokens and the api keys and gets the respective user objects
// app.use(authMiddleware.auth)

////////////////// Firebase auth stuff comes here /////////////////////////////////

let admin = require("firebase-admin");

let serviceAccount = require("./config/creds/google-cloud-service-account.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://boilerplates-mahavarkars.firebaseio.com",
});

////// That ends firebase
////////////////////////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
	console.log("Welcome to the app");
	res.status(200).json({
		success: true,
		message: "Welcome to the Boilerplate api. Please login to continue ",
	});
});

app.use("/api/v1", router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	let err = new Error("Not Found");
	err.status = 404;
	// console.log(err);
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);

	if (err.status != 404) {
		console.log(err);
		res.status(500).json({ success: false, error: err });
	} else if (err.status == 404) {
		res.status(404).json({
			success: false,
			status: 404,
			message: "Endpoint not found",
		});
	} else {
		res.status(200).json({
			success: true,
			message:
				"Welcome to the api. Please register yourself to get an access token.",
		});
	}
});

module.exports = app;

if (require.main == module) {
	console.log("\n\n [app.js] Success: No errors found in the app \n\n");
}
