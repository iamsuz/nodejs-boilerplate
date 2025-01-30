var ua = require("universal-analytics");

console.log("analytics logging function enabled:  " + "UA-XXXX-XX");
function analytics(req, res, next) {
	next();

	console.log("Hit the analytics middle ware:  " + "UA-XXXX-XX");
	var visitor = ua("UA-XXXX-XX", "6a14abda-6b12-4578-bf66-43c754eaeda9");

	console.log("The url is:  " + req.originalUrl);
	// log this to slack if needed

	// This is for pageview
	visitor.pageview(
		req.originalUrl,
		"boilerplate-api.apps.mahavarkars.io",
		"API",
		function (err) {
			// This is for event logging.
			// visitor.event("API", "boilerplate-api.apps.mahavarkars.io", req.originalUrl, function (err) {

			if (err) {
				console.log("there is an issue in logging the data");
				console.log(err);
			} else {
				console.log("successfully logged the data");
			}
		}
	);
}

module.exports = analytics;
