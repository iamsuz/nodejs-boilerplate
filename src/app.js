let express = require("express");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let nunjucks = require("nunjucks");
let fileUpload = require("express-fileupload");

let router = require("./routes/index");

let app = express();

app.get("/health", function (req, res) {
	console.log("This is a healthz check");
	res.status(200).json({ message: "OK", uptime: process.uptime() });
});

app.use(
	logger(
		`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :: (time: :response-time ms)`
	)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// for file uploads
app.use(
	fileUpload({
		// useTempFiles: true,
		// tempFileDir: '/tmp/',
		debug: true,
	})
);

nunjucks.configure("views", {
	autoescape: true,
	express: app,
});

app.use(require("./utils/headers"));
// app.use(require("./utils/analytics"));

app.get("/", function (req, res) {
	console.log("Welcome to the app");
	res.status(200).json({
		success: true,
		message: "Welcome to the Boilerplate api. Please login to continue ",
	});
});

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
