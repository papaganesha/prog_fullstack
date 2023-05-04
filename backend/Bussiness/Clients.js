var Persistence       = require('../Database/Connect')
var { getClientsPersistence, getClientByIdPersistence, addClientPersistence } = Persistence

const Bussiness = {}

Bussiness.getAllClientsBussiness = async () => {
    let clients = []
    try {
        clients = await getClientsPersistence()
    }
    catch (err) {
        throw err
    }
    return clients
}

Bussiness.getClientByIdBussiness = async (id) => {
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

Bussiness.addClientBussiness = async (cpf, nome, telefone) => {
    let client
    try {
        client = await addClientPersistence(cpf, nome, telefone)
    }
    catch (err) {
        throw err
    }
    console.log(client)
    return client
}

module.exports = Bussiness