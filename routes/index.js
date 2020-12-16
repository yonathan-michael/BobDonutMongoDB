var express = require("express");
var router = express.Router();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

const client = new MongoClient(uri, { useUnifiedTopology: true });

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Bobs Donuts by Yonathan Michael" });
});

/* Locations page. This fulfills the business requirement
of being able to see which donuts are available at each location
and which employees work at each location   */
router.get("/locations", function (req, res) {
	try {
		console.log("Connecting...");

		client.connect();

		console.log("Connected");

		const db = client.db("bobdonuts");

		const locationCollection = db.collection("locations");

		const query = {};

		locationCollection.find(query).toArray(function (err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				res.render("locationlist", {
					locationlist: result,
				});
			} else {
				res.send("No documents found");
			}
		});
	} finally {
	}
});

/* This is to look at sales log */
router.get("/sales", function (req, res) {
	try {
		console.log("Connecting...");

		client.connect();

		console.log("Connected");

		const db = client.db("bobdonuts");

		const salesCollection = db.collection("sales");

		const query = {};

		salesCollection.find(query).toArray(function (err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				res.render("saleslist", {
					saleslist: result.reverse(),
				});
			} else {
				res.send("No documents found");
			}
		});
	} finally {
	}
});

router.get("/newsale", function (req, res) {
	res.render("newsale", { title: "Add Sale" });
});

router.post("/addsale", function (req, res) {
	console.log("Connecting...");

	client.connect();

	console.log("Connected");

	const db = client.db("bobdonuts");

	const salesCollection = db.collection("sales");

	const salequery = {
		saleDate: req.body.date,
		quantity: req.body.quantity,
		donut: req.body.donut,
		location: req.body.location,
	};

	salesCollection.insertOne(salequery, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			// Redirect to the updated sales list
			res.redirect("sales");
		}
	});
});

module.exports = router;
