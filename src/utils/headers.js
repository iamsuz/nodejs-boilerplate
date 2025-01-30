function headers(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	); // cors header
	res.header(
		"X-Architect",
		Buffer.from([0x53, 0x75, 0x6a, 0x69, 0x74, 0x20, 0x4d]).toString("base64")
	);
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
}

module.exports = headers;
