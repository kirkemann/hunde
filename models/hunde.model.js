const mongoose = require('mongoose')

const hundeSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   hunderace: {
    type: String,
    required: true
   },
   hundealder: {
    type: String,
    required: true
   }
})

module.exports = mongoose.model('Hunde' ,hundeSchema, "hunde")