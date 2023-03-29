//Listar e buscar todos os clientes E cliente especifico por ID.✔️
//Atualizar dados do Cliente(por ID).✔️
//Cadastrar, criar novo Cliente.✔️
//Variaveis do Cliente: id, cpf, nome, telefone, ativo(excluido ou nao).✔️
//Dados de clientes mocados.✔️

var Controller = {}

var clients = require('../Mockup/Clients')
var accounts = require('../Mockup/Accounts')


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
            var account = {
                id: id,
                balances: [

                ]
            }
            try {
                clients.push(client)
                accounts.push(account)
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

Controller.checkBalance = async (req, res) => {
    var { id } = req.params
    var checkIfExists = false
    var checkIfHasBalance = false
    var clientAccount
    for (var client of clients) {
        if (id == client.id) {
            checkIfExists = true
        }
    }

    if (!checkIfExists) {
        res.status(400).json({ msg: `Cliente inexistente` })

    } else {
        for (var account of accounts) {
            if (account.id == id) {
                if (account.balances.length > 0) {
                    checkIfHasBalance = true
                    clientAccount = account
                }
            }
        }
        if (checkIfHasBalance) {
            res.status(200).json({ saldo: clientAccount.balances })
        } else {
            res.status(400).json({ msg: `Cliente não possui saldo` })
        }
    }
}

//Adicionar saldo para cliente por ID
//Checar se cliente existe por ID
//Verificar se cliente possui saldo na Moeda escolhida
//Caso cliente possua saldo na moeda, adicionar ao mesmo
//Caso cliente não possua saldo na moeda, adicionar moeda e novo saldo aos balancos do cliente
Controller.addBalance = async (req, res) => {
    var { id } = req.params
    var { saldo, moeda } = req.body
    var checkIfExists = false
    var checkIfHasBalance = false
    var clientAccount

    //Achando cliente no Array
    for (var client of clients) {
        if (id == client.id) {
            //Caso cliente exista
            checkIfExists = true
        }
    }

    //Checando se cliente existe
    if (!checkIfExists) {
        //Caso cliente nao exista
        res.status(400).json({ msg: `Cliente inexistente` })

        //Caso cliente exista
    } else {
        //Checar se cliente tem saldo na moeda escolhida
        for (var account of accounts) {
            if (account.id == id) {
                clientAccount = account
            }
        }
        for (var balance of clientAccount.balances) {
            if (balance.moeda == moeda && balance.saldo) {
                //Caso cliente tenha saldo na moeda
                checkIfHasBalance = true
            }
        }

        //Caso cliente possua saldo na moeda
        if (checkIfHasBalance) {
            for (var balance of clientAccount.balances) {
                if (balance.moeda == moeda) {
                    balance.saldo += saldo
                }
            }
            res.status(200).json({ saldo: clientAccount.balances })
            
        } 
        //Caso cliente não possua saldo na moeda
        else {
            //Criar novo objeto de balanco/saldo
            try {
                //Inserindo objeto de balanco/saldo nos balancos da conta do cliente
                clientAccount.balances.push({
                    moeda,
                    saldo
                })
            
            } 
            //Caso ocorrer erro durante a inserção do novo objeto de balano/saldo
            catch (err) {
                console.log(err.message)
                res.status(401).json({ msg: "Erro ao adicionar saldo" })

            }
            res.status(200).json({ saldo: clientAccount.balances })
        }
    }
}

//Retirar do saldo do Cliente por ID
//Checar se cliente existe por ID
//Verificar se cliente possui saldo na Moeda escolhida
//Diminuir saldo, com limite de 0
Controller.withdrawBalance = async (req, res) => {
    var { id } = req.params
    var { saldo, moeda } = req.body
    var checkIfExists = false
    var checkIfHasBalance = false
    var clientAccount
    console.log(saldo, moeda)

    //Achando cliente no Array
    for (var client of clients) {
        if (id == client.id) {
            //Caso cliente exista
            checkIfExists = true
        }
    }

    //Checando se cliente existe
    if (!checkIfExists) {
        //Caso cliente não exista
        res.status(400).json({ msg: `Cliente inexistente` })
        //Caso cliente exista
    } else {
        //Checar se cliente tem saldo na moeda escolhida
        //Caso cliente ter saldo, verificar se retirada não vai estourar o saldo
        //Caso retirada não estourar saldo, prosseguir com retirada
        for (var account of accounts) {
            if (account.id == id) {
                clientAccount = account
                console.log(account.id)
                if (account.balances.length > 0) {
                    checkIfHasBalance = true
                }
            }
        }
        if (checkIfHasBalance) {
            for (var balance of clientAccount.balances) {
                console.log(balance)
                if (balance.moeda == moeda) {
                    balance.saldo -= saldo
                }
            }
            res.status(200).json({ saldo: clientAccount.balances })
        } else {
            try {
                clientAccount.balances.push({
                    moeda,
                    saldo
                })
            } catch (err) {
                console.log(err.message)
                res.status(401).json({ msg: "Erro ao adicionar saldo" })

            }
            res.status(200).json({ saldo: clientAccount.balances })
        }
    }
}


module.exports = Controller;