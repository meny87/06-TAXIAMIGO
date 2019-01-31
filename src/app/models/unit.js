const mongoose = require('mongoose');


/**
 * numero:
  marca: 
  modelo: 
  dueno: 
  contactoDueno:
  placas:
  aseguradora:
  polizaSeguro:
  contactoAseguradora:
  puertas:
  lugares:
  ac:
  bt:
  especial:
 */
var UnitSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  modelo: {
    type: Number,
    required: true
  },
  dueno: {
    type: String
  },
  contactoDueno:{
    type: String
  },
  placas:{
    type: String,
    required: true
  },
  aseguradora:{
    type: String,
    required: true
  },
  polizaSeguro:{
    type: String,
    required: true
  },
  contactoAseguradora:{
    type: String,
    required: true
  },
  puertas: Number,
  lugares: Number,
  ac: String,
  bt: String,
  especial: String
});

module.exports = mongoose.model('Unit', UnitSchema);
