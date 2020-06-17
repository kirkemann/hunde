const express = require("express");
const router = express.Router();
const Bruger = require("../models/bruger.model");

//LOGIN --------


router.post('/login', async (req, res) => {

  const { brugernavn, password} = req.body;

  const bruger = await Bruger.findOne({brugernavn: brugernavn})


  if (!bruger) {
    return res.status(401).json({message: "brugernavn findes ikke"});
  }

  bruger.comparePassword(password, function(err, isMatch) {
    console.log(bruger);
    if (err) {
      throw err;
    }


    if (isMatch){

      req.session.userId = bruger._id
      res.status(200).json({ brugernavn: bruger.brugernavn })

    } else {
      res.clearCookie(process.env.SESS_NAME).status(401).json({message: 'Du blev ikke login - brugernavn eller password passer ikke'})
    }

  })
  
})


//LOGOUT --------

router.get('/logout', async (req, res) => {

  console.log("logud");

  res.clearCookie(process.env.SESS_NAME).json({message: 'Du blev logged out'})


})




//LOGGET IND --------

router.get('/loggedin', async (req, res) => {

  if (req.session.userId) {
    return res.status(200).json({message: 'Login er stadig aktiv'})

  } else {
    return res.status(401).json({ message: 'Login eksister ikke mere'})
  }

})






module.exports = router;