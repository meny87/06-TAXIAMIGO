var Unit = require('../models/unit');

module.exports = (app, passport) => {


	// index routes
	app.get('/', (req, res) => {
		res.render('index', {
			title: 'Sistema de Administración',
			needLogged: true
		});
	});

	//login view
	app.get('/login', (req, res) => {
		res.render('login', {
			layout: false,
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/control',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// signup view
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	//profile view
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			title: 'Detalles de unidad',
			user: req.user,
			userName: req.user.local.email
		});
	});

	app.get('/units', isLoggedIn, (req, res) => {

		Unit.find()
			.sort('numero')
			.exec()
			.then(unidad => {
				console.log(unidad);
				res.render('units/index', {
					title: "Unidades",
					user: req.user,
					userName: req.user.local.email,
					unidad: unidad
				});

			})
			.catch(err => {
				console.log(err);
			});

	});

	app.get('/units/edit', isLoggedIn, (req, res) => {

		Unit.findById(req.query.id, (err, unit) => {
			if (err) {
				return next();
			}

			var unitProperties = {
				isBt: unit.bt === 'Si' ? true : false,
				isAc: unit.ac === 'Si' ? true : false,
				isEspecial: unit.especial === 'Si' ? true : false,
			};

			console.log("EDIT UNIDAD", unit);

			res.render('units/edit', {
				title: "Unidades - Editar",
				user: req.user,
				userName: req.user.local.email,
				unidad: unit,
				condiciones: unitProperties
			});
		});

	});

	app.post('/units/edit', isLoggedIn, (req, res) => {
		var unidad = {

			numero: req.body.numero,
			marca: req.body.marca,
			modelo: req.body.modelo,
			placas: req.body.placas,
			aseguradora: req.body.aseguradora,
			contactoAseguradora: req.body.contactoAseguradora,
			puertas: req.body.puertas,
			ac: req.body.ac,
			bt: req.body.bt,
			especial: req.body.especial
		};

		console.log("POST UNIDAD", unidad);
		console.log("REQ.BODY", req.body);

		Unit.findOneAndUpdate({ _id: req.body.id}, {$set: unidad}, {new: true}, (err, doc) =>{
			if(err){
				console.log('ERROR', e);
				return next();
			}
			console.log("DOC", doc);

			res.redirect('/units');
		});

	});

	app.get('/units/details', isLoggedIn, (req, res) => {

		Unit.findById(req.query.id, (err, unit) => {
			if (err) {
				return next();
			}
			console.log('UNIT DETAILS: ', unit);

			res.render('units/details', {
				title: "Unidades - Detalles",
				user: req.user,
				userName: req.user.local.email,
				unidad: unit
			});
		});


	});


	app.get('/units/delete', isLoggedIn, (req, res) => {

		res.render('units/delete', {
			title: "Unidades - Eliminar",
			user: req.user,
			userName: req.user.local.email
		});

	});

	app.post('/units', isLoggedIn, (req, res) => {
		var req_body = req.body;

		const unit = new Unit({
			numero: req_body.numero,
			marca: req_body.marca,
			modelo: req_body.modelo,
			dueno: req_body.dueno,
			contactoDueno: req_body.contactoDueno,
			placas: req_body.placas,
			aseguradora: req_body.aseguradora,
			polizaSeguro: req_body.polizaSeguro,
			contactoAseguradora: req_body.contactoAseguradora,
			puertas: req_body.puertas,
			lugares: req_body.lugares,
			ac: req_body.ac,
			bt: req_body.bt,
			especial: req_body.especial
		});

		console.log("UNIT: ", unit);

		unit
			.save()
			.then(result => {
				console.log("RESULTS: ", result);

				Unit.find()
					.sort('numero')
					.exec()
					.then(unidad => {
						console.log(unidad);
						res.render('units', {
							title: "Unidades",
							user: req.user,
							userName: req.user.local.email,
							unidad: unidad
						});

					})
					.catch(err => {
						console.log(err);
					});
			})
			.catch(err => {
				console.log("ERROR: ", err);
				res.render('error', err);
			});
	});

	app.get('/owners', isLoggedIn, (req, res) => {
		res.render('owners', {
			title: "Propietarios",
			user: req.user,
			userName: req.user.local.email
		});
	});

	app.get('/drivers', isLoggedIn, (req, res) => {
		res.render('drivers', {
			title: "Conductores",
			user: req.user,
			userName: req.user.local.email
		});
	});

	app.get('/control', isLoggedIn, (req, res) => {
		res.render('control', {
			title: "Panel de Control",
			user: req.user,
			userName: req.user.local.email
		});
	});

	app.get('/incomes', isLoggedIn, (req, res) => {
		res.render('incomes', {
			title: "Cuotas Semanales",
			user: req.user,
			userName: req.user.local.email
		});
	});

	app.get('/expenses', isLoggedIn, (req, res) => {
		res.render('expenses', {
			title: "Gastos",
			user: req.user,
			userName: req.user.local.email
		});
	});

	app.get('/restricted', (req, res) => {
		res.render('restricted', {
			layout: false
		});
	});


	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/restricted');
}
