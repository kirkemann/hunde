const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const brugerSchema = new mongoose.Schema({
   brugernavn: {
    type: String,
    required: true
   },
   navn: {
    type: String,
    required: true,
    default: "John Doe"
   },
   email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    index: { unique: true }
   },
   password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [3, 'Password need to be longer']
   
   }
})


// Krypter pw - når bruger-data gemmes hvis password er ændret/nyt 
brugerSchema.pre('save', async function (next) {
   const user = this;
   // hvis bruger er rettet men password ikke ændret så spring dette over ... next() betyder forlad denne middleware
   if (!user.isModified('password')) return next();
   //Lav nye password
   const hashedPassword = await bcrypt.hash(user.password, 10)
   //Erstat password med det krypterede password
   user.password = hashedPassword
   next()
});

// Verification - cb = callback
brugerSchema.methods.comparePassword = function (indtastetPassword, cb) {
   bcrypt.compare(indtastetPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
    });
   };

module.exports = mongoose.model('Bruger', brugerSchema)