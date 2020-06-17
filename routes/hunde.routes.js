const express = require('express')
const router = express.Router()
const Hunde = require('../models/hunde.model')


// Søgning 
router.get('/soeg/:soegord' , async(req , res) => {

    const soegord = req.params.soegord; //søgeord = "sol"

    try {
        const soeghunde = await hunde.find({

            $or: [
                {"name": {"$regex" : soegord, "$options": "i" } }, //søg i alt som små bogstaver
                {"hunderace": {"$regex" : soegord, "$options": "i" } }, //søg i alt som små bogstaver
                {"hundealder": {"$regex" : soegord, "$options": "i" } } //søg i alt som små bogstaver
            ]

        })

res.json(soeghunde); // Send søgeresultatet som response til klienten / brugeren

    } catch (error) {
        return res.status(500).json({ message: "Problemer:" + error.message})
    }


});

// Getting all
router.get('/', async (req, res) => {
    try {
        const hunden = await Hunde.find()
        res.json(hunden)
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: err.message})
    }
})

// Getting One
router.get('/:id', getHunde, (req, res) => {
    
    console.log('hent en hund');

    res.json(res.hunde)
})


// Creating One
router.post('/admin', async (req, res) => {
    const hunde = new Hunde({
        name: req.body.name,
        hunderace: req.body.hunderace,
        hundealder: req.body.hundealder
    }) 
    try {
        const newHunde = await hunde.save()
        res.status(201).json(newHunde)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Updating One
router.patch('/admin/:id', getHunde, async (req, res) => {
    if (req.body.name != null ) {
        res.hunde.name = req.body.name
    }
    if (req.body.hunderace != null ) {
        res.hunde.hunderace = req.body.hunderace
    }
    if (req.body.hundealder != null ) {
        res.hunde.hundealder = req.body.hundealder
    }
    try {
        const updatedHunde = await res.hunde.save()
        res.json(updatedHunde)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Deleting One
router.delete('/admin/:id', getHunde, async (req, res) => {
    try {
        await res.hunde.remove()
        res.json({ message: 'Deleted Hund'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

async function getHunde(req, res, next) {
    let hunde
    try{
        hunde= await Hunde.findById(req.params.id)
        if ( hunde == null) {
            return res.status(404).json({ message: 'Cannot find hund' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.hunde = hunde
    next()
}

module.exports = router