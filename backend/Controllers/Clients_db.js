//Listar e buscar todos os clientes E cliente especifico por ID.✔️
//Atualizar dados do Cliente(por ID).✔️
//Cadastrar, criar novo Cliente.✔️
//Ativar e inativar cliente.✔️
//Variaveis do Cliente: id, cpf, nome, telefone, ativo(ativo=1, inativo=0).✔️
//Dados de clientes inseridos no banco.✔️

const { v4: uuidv4 } = require('uuid');
const { getAllClientsBussiness, getClientByIdBussiness, addClientBussiness } = require('../Bussiness/Clients')
const { connection } = require('../Database/Connect')
var Controller = {}


//Get all the clients(Busca todos os cliente)
Controller.getClients = async (req, res) => {
    var clients = []
    //getAllClients from Bussiness
    const results = await getAllClientsBussiness()
    for (let client of results) {
        var clientObj = {
            id: client.id_cliente,
            cpf: client.cpf,
            nome: client.nome,
            telefone: client.telefone,
            status: client.status == 0 ? "inativo" : "ativo"
        }
        try {
            clients.push(clientObj)
        }
        catch (err) {
            throw err
        }
    }
    res.status(200).json({ clientes: clients })


}

//Get client by ID(Busca cliente por ID)
Controller.getClientByIdController = async (req, res) => {
    var { id } = req.params

    let client = await getClientByIdBussiness(id)

    if (client) {
        res.status(200).json({ client })
    }
    //Caso não exista cliente, retornar mensagem
    else {
        res.status(400).json({ msg: "Cliente não cadastrado" })
    }

}


//Create new client(Criar novo cliente)
//Check if client doenst exists(Checar se cliente não existe)
//Check info(Verificar informacoes)
//Insert new client(Adicionar cliente)
Controller.addClientController = async (req, res) => {
    const { cpf, nome, telefone } = req.body
    //Checa se todos os parametros de cadastro estão presentes
    if (cpf, nome, telefone) {
        let response = await addClientBussiness(cpf, nome, telefone)
        console.log("RESPOSTA = >", response)
        if (response.status) {
            res.status(200).json({ msg: response.msg })
        }
        //Caso não exista cliente, retornar mensagem
        else {
            res.status(400).json({ msg: response.msg })
        }
    }
    //Caso faltem parametros de cadastro
    else {
        res.status(400).json({ msg: `Faltam informações para o cadastro de cliente` })
    }
}


//Update client info(Atualizar informações de cliente)
//Check if client doenst exists(Checar se cliente não existe)
//Check passed info/parameters (Verificar quais informações/parametros foram passadas)
//Update info by required parameters(Alterar informações de acordo com os parametros do requerimento)
Controller.updateClient = async (req, res) => {
    var { id } = req.params
    var { cpf, nome, telefone } = req.body
    //Checar parametros
    if (cpf || nome || telefone) {
        //CHECANDO SE CLIENTE EXISTE
        //Criando Query String
        var queryString = `SELECT 1 FROM CLIENTES WHERE ID_CLIENTE = ?`
        //Executando query passando QueryString e parametros 
        const checkIfClientExists = await connection.query(queryString, id).catch(err => { throw err })
        //CheckIfClientExists sendo 1 cliente existe
        //Caso cliente nao exista
        if (checkIfClientExists[0]["1"] !== 1) {
            res.status(400).json({ msg: `Cliente inexistente` })
        }
        //Caso cliente exista
        else {
            //Tentar executar
            try {
                //Se usuario quiser alterar o CPF
                if (cpf) {
                    //Criando Query String
                    var queryString = `UPDATE CLIENTES SET CPF = ? WHERE ID_CLIENTE = ?`
                    //Executando query passando QueryString e parametros 
                    await connection.query(queryString, [cpf, id]).catch(err => { throw err })
                }
                //Se usuario quiser alterar o Nome
                if (nome) {
                    //Criando Query String
                    var queryString = `UPDATE CLIENTES SET NOME = ? WHERE ID_CLIENTE = ?`
                    //Executando query passando QueryString e parametros 
                    await connection.query(queryString, [nome, id]).catch(err => { throw err })
                }
                if (telefone) {
                    //Criando Query String
                    var queryString = `UPDATE CLIENTES SET TELEFONE = ? WHERE ID_CLIENTE = ?`
                    //Executando query passando QueryString e parametros 
                    await connection.query(queryString, [telefone, id]).catch(err => { throw err })
                }
            }
            //Caso ocorra erro na tentativa de alteração do cliente
            catch (error) {
                res.status(400).json({ msg: `Erro ao alterar cliente : ${error.message}` })

            }
            res.status(201).json({ msg: `Cliente alterado com sucesso` })

        }

    }
    //Caso nao exista nenhum parametro de atualizacao inserido
    else {
        res.status(400).json({ msg: `No minimo uma informação deve ser escolhida para alteramento` })

    }
}


//Inactivate client(Inativar cliente)
//Check if client doenst exists(Checar se cliente não existe)
//Check state of status(Checa o estado do status)
//Update status info from 1 to 0 - active to inactive(Altera o status de 1 para 0)
Controller.inactivateClient = async (req, res) => {
    var { id } = req.params
    var queryString = `SELECT * FROM CLIENTES WHERE ID_CLIENTE = ?`
    const client = await connection.query(queryString, id).catch(err => { throw err })
    if (client.length > 0) {
        if (client[0].status == 1 || client[0].status == 2) {
            var queryString = `UPDATE CLIENTES SET STATUS = 0 WHERE ID_CLIENTE = ?`
            const result = await connection.query(queryString, id).catch(err => { throw err })
            if (result.affectedRows > 0) {
                res.status(201).json({ msg: `Cliente inativado com sucesso` })
            }



        } else {
            res.status(400).json({ msg: `Cliente ja esta inativado` })
        }
    }
    else {
        res.status(400).json({ msg: `Cliente não existe` })
    }


}

//Inactivate client(Inativar cliente)
//Check if client doenst exists(Checar se cliente não existe)
//Check state of status(Checa o estado do status)
//Update status info from 0 to 1 - inactive to active(Altera o status de 1 para 0)
Controller.activateClient = async (req, res) => {
    var { id } = req.params
    var queryString = `SELECT * FROM CLIENTES WHERE ID_CLIENTE = ?`
    const client = await connection.query(queryString, id).catch(err => { throw err })
    if (client.length > 0) {
        if (client[0].status == 0 || client[0].status == 2) {
            var queryString = `UPDATE CLIENTES SET STATUS = 1 WHERE ID_CLIENTE = ?`
            const result = await connection.query(queryString, id).catch(err => { throw err })
            if (result.affectedRows > 0) {
                res.status(201).json({ msg: `Cliente ativado com sucesso` })
            }



        } else {
            res.status(400).json({ msg: `Cliente ja esta ativado` })
        }
    }
    else {
        res.status(400).json({ msg: `Cliente não existe` })
    }


}

//Inactivate client(Inativar cliente)
//Check if client doenst exists(Checar se cliente não existe)
//Check state of status(Checa o estado do status)
//Update status info from 0 to 1 - inactive to active(Altera o status de 1 para 0)
Controller.blockClient = async (req, res) => {
    var { id } = req.params
    var queryString = `SELECT * FROM CLIENTES WHERE ID_CLIENTE = ?`
    const client = await connection.query(queryString, id).catch(err => { throw err })
    if (client.length > 0) {
        if (client[0].status == 0 || client[0].status == 2) {
            var queryString = `UPDATE CLIENTES SET STATUS = 1 WHERE ID_CLIENTE = ?`
            const result = await connection.query(queryString, id).catch(err => { throw err })
            if (result.affectedRows > 0) {
                res.status(201).json({ msg: `Cliente bloqueado com sucesso` })
            }



        } else {
            res.status(400).json({ msg: `Cliente ja esta bloqueado` })
        }
    }
    else {
        res.status(400).json({ msg: `Cliente não existe` })
    }


}

Controller.checkBalance = async (req, res) => {
    var { id } = req.params
    var balances = []
    // var queryString = `SELECT 1 FROM CLIENTES WHERE ID_CLIENTE = ?`
    // const checkIfClientExists = await connection.query(queryString, id).catch(err => { throw err })
    // console.log(checkIfClientExists)
    // if (checkIfClientExists[0]["1"] == 1) {
    var queryString = `SELECT * FROM CONTAS A WHERE A.ID_CLIENTE = ?`
    await connection.query(queryString, id)
        .then(accounts => {
            console.log(accounts)
        })
        .catch(err => { throw err })

    // for (let account of accounts) {
    //     console.log("=> ", account)
    //     balances.push({
    //         moeda: account.moeda,
    //         saldo: account.saldo
    //     })
    // }
    res.status(400).json({ balances })
    // }
    //Caso usuario não existir
    // else {
    //     res.status(400).json({ msg: `Cliente inexistente` })
    // }


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
    var checkIfHasBalance

    //Achando cliente no Array
    connection.query(`SELECT 1 FROM CLIENTES A WHERE A.ID_CLIENTE = ?`, id, function (error, results, fields) {
        if (error) {
            res.status(500).json({ "msg": `Erro durante busca de cliente por ID - {${error.sqlMessage}}` })
        }
        if (results.length > 0 && results[0]["1"] == 1) {
            checkIfExists = true
        }
        //Checando se cliente existe
        if (!checkIfExists) {
            //Caso cliente nao exista
            res.status(400).json({ msg: `Cliente inexistente` })

            //Caso cliente exista
        } else {
            connection.query(`SELECT * FROM CONTAS A WHERE A.ID_CLIENTE = ?`, id, function (error, results, fields) {
                if (error) {
                    res.status(500).json({ "msg": `Erro durante busca de cliente por ID - {${error.sqlMessage}}` })
                }
                //Caso cliente possua saldo na moeda
                if (results.length > 0) {
                    console.log("RESULTS", results)
                    //Loop de balancos do conta do cliente
                    for (var balance of results) {
                        //Caso moeda atual do balanco seja a mesma escolhida para deposito
                        if (balance.moeda == moeda.toUpperCase()) {
                            //Adicionando valor ao saldo/balanco
                            var newSaldo = balance.saldo + saldo
                            var sql = `UPDATE CONTAS SET SALDO = ?, DATA_ALTERACAO = NOW() WHERE CONTAS.MOEDA = ? AND CONTAS.ID_CLIENTE = ?`
                            connection.query(sql, [newSaldo, moeda.toUpperCase(), id], function (error, results, fields) {
                                if (error) {
                                    res.status(500).json({ "msg": "Erro durante inserçao de saldo" })
                                } else {
                                    //Mostrar saldos/balancos apos inserção de saldo
                                    res.status(200).json({ msg: "Saldo inserido" })
                                }
                            })
                        }
                    }
                }
                //Caso cliente não possua saldo na moeda
                else {
                    var newId = uuidv4()
                    var sql = `INSERT INTO CONTAS(ID_CONTA, ID_CLIENTE, MOEDA, SALDO) VALUES(?, ?,?,?)`
                    connection.query(sql, [newId, id, moeda.toUpperCase(), saldo], function (error, results, fields) {
                        if (error) {
                            console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
                            res.status(500).json({ "msg": "Erro durante inserção de saldo" })
                        }
                        else {
                            if (results.affectedRows > 0) {
                                console.log(results)
                                res.status(201).json({ "msg": "Saldo adicionado com sucesso" })

                            } else {
                                res.status(201).json({ "msg": "Erro durante inserção de saldo" })

                            }
                        }
                    })
                }
            })


        }
    })


}

//Retirar do saldo do Cliente por ID
//Checar se cliente existe por ID
//Verificar se cliente possui saldo na Moeda escolhida
//Checar se valor de retirada nao ira estourar o saldo
//Diminuir o saldo
Controller.withdrawBalance = async (req, res) => {
    var { id } = req.params
    var { saldo, moeda } = req.body
    var checkIfExists = false
    var checkIfHasBalance
    var hasBalanceInCurrency = false

    //Achando cliente no Array
    connection.query(`SELECT 1 FROM CLIENTES A WHERE A.ID_CLIENTE = ?`, id, function (error, results, fields) {
        if (error) {
            res.status(500).json({ "msg": `Erro durante busca de cliente por ID - {${error.sqlMessage}}` })
        }
        if (results.length > 0 && results[0]["1"] == 1) {
            checkIfExists = true
        }
        //Checando se cliente existe
        if (!checkIfExists) {
            //Caso cliente nao exista
            res.status(400).json({ msg: `Cliente inexistente` })

            //Caso cliente exista
        } else {
            connection.query(`SELECT * FROM CONTAS A WHERE A.ID_CLIENTE = ?`, id, function (error, results, fields) {
                if (error) {
                    res.status(500).json({ "msg": `Erro durante busca de cliente por ID - {${error.sqlMessage}}` })
                }
                //Caso cliente possua saldo na moeda
                if (results.length > 0) {
                    //Loop de balancos do conta do cliente
                    for (var balance of results) {
                        //Caso moeda atual do balanco seja a mesma escolhida para deposito
                        if (balance.moeda == moeda.toUpperCase()) {
                            hasBalanceInCurrency = true
                        }
                    }
                    if (hasBalanceInCurrency) {
                        //Adicionando valor ao saldo/balanco
                        var newSaldo = balance.saldo - saldo
                        var sql = `UPDATE CONTAS SET SALDO = ?, DATA_ALTERACAO = NOW() WHERE CONTAS.MOEDA = ? AND CONTAS.ID_CLIENTE = ?`
                        connection.query(sql, [newSaldo, moeda.toUpperCase(), id], function (error, results, fields) {
                            if (error) {
                                res.status(500).json({ "msg": "Erro durante inserçao de saldo" })
                            } else {
                                //Mostrar saldos/balancos apos inserção de saldo
                                res.status(200).json({ msg: "Saldo removido" })
                            }
                        })
                    } else {
                        res.status(400).json({ "msg": "Cliente não possui saldo nesta moeda" })

                    }

                }
                //Caso cliente não possua saldo na moeda
                else {
                    res.status(400).json({ "msg": "Cliente não possui saldo em nenhuma moeda" })
                }

            })


        }
    })


}


module.exports = Controller;