var Persistence       = require('../Database/Connect')
var { getAllClients, getClientById } = Persistence

const Bussiness = {}

Bussiness.getAllClients = async () => {
    let clients = []
    try {
        clients = await getAllClients()
    }
    catch (err) {
        throw err
    }
    return clients
}

Bussiness.getClientById = async (id) => {
    let client
    try {
        client = await getClientById(id)
    }
    catch (err) {
        throw err
    }
    console.log(client)
    return client
}

module.exports = Bussiness