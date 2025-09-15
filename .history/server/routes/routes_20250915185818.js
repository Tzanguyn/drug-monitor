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
route.post('/api/drugs', validateDrugInput, controller.create);
route.get('/api/drugs', controller.find);
route.put('/api/drugs/:id', validateDrugInput, controller.update);
route.delete('/api/drugs/:id', controller.delete);
route.post('/api/drugs/:id/purchase', controller.purchase);

// Middleware to validate drug input
function validateDrugInput(req, res, next) {
    const name = req.body.name;
    const dosage = req.body.dosage;
    const card = Number(req.body.card); // ép kiểu về số
    const pack = Number(req.body.pack);
    const perDay = Number(req.body.perDay);

    if (typeof name !== 'string' || name.length <= 5) {
        return res.status(400).json({ success: false, message: 'Name must be longer than 5 characters.' });
    }
    const dosageRegex = /^(\d+-morning,\d+-afternoon,\d+-night|\d+mg)$/;
    if (typeof dosage !== 'string' || !dosageRegex.test(dosage)) {
        return res.status(400).json({ success: false, message: 'Dosage must be in format XX-morning,XX-afternoon,XX-night hoặc XXmg.' });
    }
    if (isNaN(card) || card <= 1000) {
        return res.status(400).json({ success: false, message: 'Card must be a number greater than 1000.' });
    }
    if (isNaN(pack) || pack <= 0) {
        return res.status(400).json({ success: false, message: 'Pack must be a number greater than 0.' });
    }
    if (isNaN(perDay) || perDay <= 0 || perDay >= 90) {
        return res.status(400).json({ success: false, message: 'PerDay must be a number greater than 0 and less than 90.' });
    }
    next();
}
module.exports = route;//exports this so it can always be used elsewhere
res.render('purchase', { drugs, purchasedDrugs });