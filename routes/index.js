var express = require('express');
var router = express.Router();

const firebaseDB = require('../connections/firebase-admin');
const productsRef = firebaseDB.ref('/Products');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

// Read
router.get('/products/get', function (req, res, next) {
	productsRef.once('value', (snapshot) => {
		res.send({
			success: true,
			data: snapshot.val(),
		});
	});
});

// Create
router.post('/products/post', function (req, res, next) {
	let productRef = productsRef.push();

	let data = {
		title: req.body.title,
		id: req.body.id,
	};

	productRef.set({ data }).then((snapshot) => {
		res.send({
			success: true,
			data: snapshot.val(),
		});
	});
});

// Remove by body.id
router.post('/products/delete', function (req, res, next) {
	const _id = req.body.id;

	productsRef
		.child(_id)
		.remove()
		.then(() => {
			productsRef.once('value', (snapshot) => {
				res.send({
					success: true,
					data: snapshot.val(),
				});
			});
		});
});

// Remove by params.id => fails
router.post('/products/delete/:id', function (req, res, next) {
	const _id = req.params.id;

	productsRef
		.child(_id)
		.remove()
		.then(() => {
			productsRef.once('value', (snapshot) => {
				console.log(_id);

				res.send({
					success: true,
					data: snapshot.val(),
				});
			});
		});
});

// Update
router.put('/products/update/:id', function (req, res, next) {
	const _id = req.params.id;

	let data = {
		title: req.body.title,
		id: req.body.id,
	};

	productsRef
		.child(_id)
		.update(data)
		.then(() => {
			productsRef.once('value', (snapshot) => {
				res.send({
					success: true,
					data: snapshot.val(),
				});
			});
		});
});

module.exports = router;
