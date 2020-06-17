const express = require("express");
const router = express.Router();
const Bruger = require("../models/bruger.model");


//------- Hent/get alle
//------- GET http://localhost.5002/bruger/admin

router.get('/', async (req, res) => {

    console.log("HENT ALLE");
    
    try {
        const bruger = await Bruger.find();

        res.json(bruger);

    } catch (err) {
        res.status(500).json({mesage: "Der var en fejl i / :" + err.mesage }); // 500 = serverproblem
    }
});

//------- Hent/get udvalgt bruger
//------- GET http://localhost.5002/bruger/xxxxxx

router.get('/:id', findBruger, async (req, res) => {

    console.log("HENT UDVALGT")

    res.json(res.bruger);
    

});

//------ ADMIN ROUTES --------------------------------

//------ Opret/Post NY -------------------------------
//------ Post http://localhost:5002/bruger/admin

router.post('/', async (req, res) => {

    console.log("POST", req.body);

    try {

        let bruger = await Bruger.findOne({ brugernavn: req.body.brugernavn })
        console.log("bruger", bruger)

        if (bruger) {

            console.log("bruger findes i forvejen = kan ikke oprettes igen")
            return res.status(401).json({ message: "brugeren findes allerede (OBS - denne besked skal laves om - GDPR!" }) 
        
        } else {
            console.log("bruger findes ikke i forvejen")
            bruger = new Bruger(req.body);
            const nybruger = await bruger.save();
            res.status(201).json({ message: "Ny Bruger er oprettet", nybruger: nybruger });   
        }
        
    }
    catch (error) {

        res.status(400).json({ message: "der er sket en fejl", error: error.message });

    }
    
})


//------- Slet/Delete alle
//------- Delete http://localhost.5002/bruger/xxxxxxxx

router.delete('/:id', findBruger, async ( req, res ) => {

    console.log("DELETE")

    try {

        await res.bruger.remove();
        res.status(200),json({ message: 'Bruger er nu slettet' })

    } catch (error) {
        res.json(500).json({ message: 'Bruger kan ikke slettes - der er opstået en fejl: ' + error.message })
    }
       
});

//------- RET/Ret alle
//------- RET http://localhost.5002/bruger/xxxxxxxx

router.put('/:id', findBruger, async (req, res) => {

    console.log("PUT")

    try {

        res.bruger.brugernavn =req.body.brugernavn;
        res.bruger.navn =req.body.navn;
        res.bruger.email =req.body.email;
        res.bruger.password = req.body.password;

        await res.bruger.save();
        res.status(200).json({ message: 'bruger er rettet', rettetbruger: res.bruger });
   
    } catch (error) {
        res.status(400).json({ message: 'Bruger kan ikke rettes - der er opstået en fejl: ' + error.message })

    }
    
});



//MIDDELWARE

// FIND FRA ID  ------------------------------------------------

async function findBruger(req, res, next) {

    console.log("FIND UD FRA ID", req.params.id)
    let bruger;

    try {

        bruger = await Bruger.findById(req.params.id);

        if (bruger == null) {
            return res.status(404).json({ message: 'Der findes ikke en bruger med den ID' });
        }


    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Problemer: " + error.message });    
    }
    
    res.bruger = bruger; // put det fundne ind i responset
    next();
}

module.exports = router;
