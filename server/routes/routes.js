const express = require('express');// As in the server.js
const route = express.Router(); //Allows us use express router in this file
const services = require('../services/render');//uses the render.js file from services here

const controller = require('../controller/controller');//uses the render.js file from services here

// API mua hàng
route.get('/', services.home);


route.get('/manage', services.manage);
route.get('/dosage', services.dosage);
route.get('/purchase', services.purchase);
route.get('/add-drug', services.addDrug);
route.get('/update-drug', services.updateDrug);



// API for CRUD operations
route.post('/api/drugs', controller.create);
route.get('/api/drugs', controller.find);
route.put('/api/drugs/:id', controller.update);
route.delete('/api/drugs/:id', controller.delete);

// Middleware to validate drug input
function validateDrugInput(req, res, next) {
	const { name, dosage, card, pack, perDay } = req.body;
	// a. Name has length more than five
	if (!name || name.length <= 5) {
		return res.status(400).json({ success: false, message: 'Name must be longer than 5 characters.' });
	}
	// b. Dosage format: XX-morning,XX-afternoon,XX-night (X is digit)
	const dosageRegex = /^\d+-morning,\d+-afternoon,\d+-night$/;
	if (!dosage || !dosageRegex.test(dosage)) {
		return res.status(400).json({ success: false, message: 'Dosage must follow the format: XX-morning,XX-afternoon,XX-night (X is digit).' });
	}
	// c. Card is more than 1000
	if (typeof card !== 'number' || card <= 1000) {
		return res.status(400).json({ success: false, message: 'Card must be a number greater than 1000.' });
	}
	// d. Pack is more than 0
	if (typeof pack !== 'number' || pack <= 0) {
		return res.status(400).json({ success: false, message: 'Pack must be a number greater than 0.' });
	}
	// e. PerDay is more than 0 and less than 90
	if (typeof perDay !== 'number' || perDay <= 0 || perDay >= 90) {
		return res.status(400).json({ success: false, message: 'PerDay must be a number greater than 0 and less than 90.' });
	}
	next();
}
module.exports = route;//exports this so it can always be used elsewhere