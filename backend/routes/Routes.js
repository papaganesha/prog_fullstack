
const router = require('express').Router();
// const {
//     addClient, 
//     getClients,
//     getClientById,
//     updateClient,
//     inactivateClient,
//     activateClient,
//     checkBalance,
//     addBalance,
//     withdrawBalance
// } = require('../Controllers/Clients')

const {
    addClient, 
    getClients,
    getClientById,
    updateClient,
    inactivateClient,
    activateClient,
    checkBalance,
    addBalance,
    withdrawBalance
} = require('../Controllers/Clients_db')

router.get("/", (req, res)=>{
    res.send("hello")
})


router.get("/api/clients", getClients)

router.get("/api/clients/:id", getClientById)

router.get("/api/balance/:id", checkBalance)

router.post("/api/clients", addClient)

router.post("/api/balance/:id", addBalance)

router.post("/api/withdraw/:id", withdrawBalance)

router.put("/api/clients/:id", updateClient)

router.put("/api/activate/:id", activateClient)

router.put("/api/inactivate/:id", inactivateClient)


module.exports = router
