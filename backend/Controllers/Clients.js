//Listar e buscar todos os clientes ou cliente especifico por ID.
//Atualizar dados do Cliente(por ID).
//Cadastrar, criar novo Cliente.
//Variaveis do Cliente: id, cpf, nome, telefone, ativo(excluido ou nao).

var Controller = {}

var clients = require('../Mockup/Clients')


//GET ALL THE CLIENTS
Controller.getClients = async (req, res) => {
    res.status(200).json(clients)
}

//GET CLIENT BY ID
Controller.getClientById = async (req, res) => {
    var { id } = req.params
    var client
    for (let i of clients) {
        if (i.id == id) {
            client = i
        }
    }
    if (client) {
        res.status(200).json({ client })
    } else {
        res.status(400).json({ msg: "Cliente não cadastrado" })
    }
}


// CREATE NEW CLIENT
Controller.addClient = async (req, res) => {
    const { cpf, nome, telefone } = req.body
    var checkIfExists = false
    if (cpf, nome, telefone) {
        for (let i of clients) {
            if (i.cpf == cpf) {
                checkIfExists = true
            }
        }
        if (checkIfExists) {
            res.status(400).json({ msg: `Cliente com este cpf ja foi cadastrado` })
        } else {
            var client = {
                id: String(Number(clients[clients.length - 1].id) + 1),
                cpf,
                nome,
                telefone,
                ativo: true
            }
            try {
                clients.push(client)
                res.status(201).json({ msg: "Cliente cadastrado" })
            }
            catch (error) {
                res.status(400).json({ msg: `Erro cadastro cliente : ${error.message}` })
            }
            console.log(clients[clients.length - 1])
        }

    } else {
        res.status(400).json({ msg: `Faltam informações para o cadastro de cliente` })
    }
}

//UPDATE CLIENT INFO
Controller.updateClient = async (req, res) => {
    var { id } = req.params
    var { cpf, nome, telefone } = req.body
    if (cpf || nome || telefone) {
        var index
        for (var i in clients) {
            if (id == clients[i].id) {
                index = i
            }
        }
        if (index == -1) {
            res.status(400).json({ msg: `Cliente inexistente` })

        } else {
            try {
                if (cpf) {
                    clients[index].cpf = cpf
                }
                if (nome) {
                    clients[index].nome = nome
                }
                if (telefone) {
                    clients[index].telefone = telefone
                }
            } catch (error) {
                res.status(400).json({ msg: `Erro alterar cliente : ${error.message}` })

            }
            res.status(201).json({ msg: `Cliente alterado com sucesso` })

        }

    } else {
        res.status(400).json({ msg: `No minimo uma informação deve ser escolhida para alteramento` })

    }
}


//INACTIVATE CLIENT
Controller.inactivateClient = async (req, res) => {
    var { id } = req.params
    var index
    for (var i = 0; i < clients.length; i++) {
        if (id == clients[i].id) {
            index = i
        }
    }
    if (index == -1) {
        res.status(400).json({ msg: `Cliente inexistente` })

    } else {
        if (clients[index].ativo == true) {
            try {
                clients[index].ativo = false
            } catch (error) {
                res.status(400).json({ msg: `Erro inativar cliente : ${error.message}` })

            }
            res.status(201).json({ msg: `Cliente inativado com sucesso` })

        } else {
            res.status(201).json({ msg: `Cliente ja esta inativado` })
        }

    }
}

//ACTIVATE CLIENT
Controller.activateClient = async (req, res) => {
    var { id } = req.params
    var index
    for (var i = 0; i < clients.length; i++) {
        if (id == clients[i].id) {
            index = i
        }
    }
    if (index == -1) {
        res.status(400).json({ msg: `Cliente inexistente` })

    } else {
        if (clients[index].ativo == false) {
            try {
                clients[index].ativo = true
            } catch (error) {
                res.status(400).json({ msg: `Erro inativar cliente : ${error.message}` })

            }
            res.status(201).json({ msg: `Cliente ativado com sucesso` })

        } else {
            res.status(201).json({ msg: `Cliente ja esta ativado` })
        }

    }
}

module.exports = Controller;