
const router = require('express').Router();
const {
    addClient, 
    getClients,
    getClientById,
    updateClient,
    inactivateClient,
    activateClient
} = require('../Controllers/Clients')


router.get("/", (req, res)=>{
    res.send("hello")
})


router.get("/client", getClients)

router.get("/client/:id", getClientById)

router.post("/client", addClient)

router.put("/client/:id", updateClient)

router.put("/activate/:id", activateClient)

router.put("/inactivate/:id", inactivateClient)

module.exports = router
