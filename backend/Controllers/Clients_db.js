//Listar e buscar todos os clientes E cliente especifico por ID.✔️
//Atualizar dados do Cliente(por ID).✔️
//Cadastrar, criar novo Cliente.✔️
//Variaveis do Cliente: id, cpf, nome, telefone, ativo(excluido ou nao).✔️
//Dados de clientes mocados.✔️
const { v4: uuidv4 } = require('uuid');
var { connection } = require('../Database/Connect')


var Controller = {}

var clients = require('../Mockup/Clients')
var accounts = require('../Mockup/Accounts')


//GET ALL THE CLIENTS
Controller.getClients = async (req, res) => {
    var clients = []
    connection.query(`SELECT * FROM CLIENTES`, function (error, results, fields) {
        if (error) {
            //throw error
            console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
        };
        // results.map((client)=>{

        // })
        for (let client of results) {
            var clientObj = {
                id: client.id_cliente,
                cpf: client.cpf,
                nome: client.nome,
                telefone: client.telefone
            }
            try {
                clients.push(clientObj)
            }
            catch (error) {
                console.log(error)
            }
            console.log(clientObj)
        }
        console.log("CLIENTES: ", clients)
        res.status(200).json({ clients })
    });

}

//GET CLIENT BY ID
Controller.getClientById = async (req, res) => {
    var { id } = req.params
    //Define variavel para instanciar cliente

    connection.query(`SELECT * FROM CLIENTES WHERE ID_CLIENTE = ?`, id, function (error, results, fields) {
        if (error) {
            console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
            res.status(500).json({ "msg": "Erro durante busca de cliente por ID" })
        };
        //Verifica se resultado nao esta nulo
        if (results[0]) {
            //Criar objeto cliente
            var client = {
                id: results[0].id_cliente,
                cpf: results[0].cpf,
                nome: results[0].nome,
                telefone: results[0].telefone
            }
        }
        //Se existir cliente, retorna-lo 
        if (client) {
            res.status(200).json({ client })
        }
        //Caso não exista cliente, retornar mensagem
        else {
            res.status(400).json({ msg: "Cliente não cadastrado" })
        }
    });

}


//Criar novo cliente
//Checar se cliente não existe
//Verificar informacoes
//Adicionar cliente
Controller.addClient = async (req, res) => {
    const { cpf, nome, telefone } = req.body
    //Variavel para checar existencia do cliente
    var checkIfExists = false
    //Checa se todos os parametros de cadastro estão presentes
    if (cpf, nome, telefone) {
        //Checar se cliente existe de acordo com o CPF
        //PROCEDURE AQUI
        connection.query(`SELECT 1 FROM CLIENTES A WHERE A.CPF = ?`, cpf, function (error, results, fields) {
            if (error) {
                console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
                //res.status(500).json({"msg": "Erro durante busca de cliente por ID"})
            }
            console.log()
            if (results.length > 0 && results[0]["1"] == 1) {
                console.log("USUARIO EXISTE")
                checkIfExists = true
            }
            //Caso usuario existir
            if (checkIfExists) {
                res.status(400).json({ msg: `Cliente com este cpf ja foi cadastrado` })
            }
            //Caso usuario não existir
            else {
                var newId = uuidv4()
                var sql = "INSERT INTO CLIENTES (ID_CLIENTE, CPF, NOME, TELEFONE) VALUES (?, ?, ?, ?)";
                connection.query(sql, [newId, cpf, nome, telefone], function (err, result) {
                    if (err) throw err;
                    else {
                        res.status(400).json({ msg: `Cliente ${nome} cadastrado com sucesso` })
                    }
                });
            }
        })
    }
    //Caso faltem parametros de cadastro
    else {
        res.status(400).json({ msg: `Faltam informações para o cadastro de cliente` })
    }
}

//UPDATE CLIENT INFO
//Atualizar informações de cliente
//Checar se cliente existe
//Verificar quais informações/parametros foram passadas
//Alterar informações de acordo com os parametros do requerimento
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
    var balances = []
    connection.query(`SELECT 1 FROM CLIENTES A WHERE A.ID_CLIENTE = ?`, id, function (error, results, fields) {
        if (error) {
            console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
            //res.status(500).json({"msg": "Erro durante busca de cliente por ID"})
        }
        console.log()
        if (results.length > 0 && results[0]["1"] == 1) {
            console.log("USUARIO EXISTE")
            checkIfExists = true
        }
        //Caso usuario existir
        if (checkIfExists) {
            var sql = "SELECT * FROM CONTAS WHERE ID_CLIENTE = ?";
            connection.query(sql, [id], function (err, result) {
                if (err) throw err;
                else {
                    for (let account of result) {
                        console.log("=> ", account)
                        balances.push({
                            moeda: account.moeda,
                            saldo: account.saldo
                        })
                    }
                    res.status(400).json({ balances })
                }
            });
        }
        //Caso usuario não existir
        else {
            res.status(400).json({ msg: `Cliente inexistente` })
        }
    })

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
    var clientAccount

    //Achando cliente no Array
    connection.query(`SELECT 1 FROM CLIENTES A WHERE A.ID_CLIENTE = ?`, id, function (error, results, fields) {
        if (error) {
            console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
            //res.status(500).json({"msg": "Erro durante busca de cliente por ID"})
        }
        if (results.length > 0 && results[0]["1"] == 1) {
            console.log("USUARIO EXISTE")
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
                    console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
                    //res.status(500).json({"msg": "Erro durante busca de cliente por ID"})
                }
                else {
                    checkIfHasBalance = results
                }
                //Caso cliente possua saldo na moeda
                console.log("AASSS", checkIfHasBalance)
                if (checkIfHasBalance) {
                    console.log("AAAA")
                    //Loop de balancos do conta do cliente
                    for (var balance of results) {
                        //Caso moeda atual do balanco seja a mesma escolhida para deposito
                        if (balance.moeda == moeda) {
                            //Adicionando valor ao saldo/balanco
                            console.log("AQUI ",balance.saldo)
                            var newSaldo = balance.saldo + saldo
                            var sql = `UPDATE CONTAS SET SALDO = ? WHERE CONTAS.MOEDA = 'USD' AND CONTAS.ID_CLIENTE = ?` 
                            connection.query(sql, [newSaldo, id], function (error, results, fields) {
                                if (error) {
                                    console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
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
                    var sql = `INSERT INTO CONTAS(ID_CLIENTE, MOEDA, SALDO) VALUES(?,?,?)`
                    connection.query(sql, [id, moeda, saldo], function (error, results, fields) {
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
    var checkIfHasBalance = false
    var clientAccount
    var exceptedWithdrawValue = false

    //Achando cliente no array
    //Loop de clientes do array de clientes
    for (var client of clients) {
        //Caso cliente do loop possuir mesmo ID da requisicao
        if (id == client.id) {
            //Setando cliente como existente
            checkIfExists = true
        }
    }

    //Checando se cliente existe
    if (!checkIfExists) {
        //Caso cliente não exista
        res.status(400).json({ msg: `Cliente inexistente` })

    }
    //Caso cliente exista
    else {
        //Achar conta do cliente
        //Loop de contas de array de Contas de Clientes
        for (var account of accounts) {
            //Caso id de cliente da conta seja o mesmo ID da requisicao
            if (account.id == id) {
                //Setando conta do cliente
                clientAccount = account
            }
        }
        //Verificar balancos na conta do cliente
        //Looping de balancos na conta do cliente
        for (var balance of clientAccount.balances) {
            //Caso cliente possua saldo na moeda escolhida
            if (balance.moeda == moeda) {
                //Setando que cliente possui balanco na moeda escolhida
                checkIfHasBalance = true
            }
        }

        //Caso cliente possua saldo/balanco na moeda escolhida
        if (checkIfHasBalance) {
            //Loop dos balancos dentro da conta do cliente
            for (var balance of clientAccount.balances) {
                //Achando balanco da moeda escolhida
                if (balance.moeda == moeda) {
                    //Checar se retirada não sera maior que o saldo
                    if (balance.saldo >= saldo) {
                        //Caso retirada for menor que o saldo
                        //Retirando valor do saldo
                        balance.saldo -= saldo

                    } else {
                        //Caso retirada estourar o saldo
                        exceptedWithdrawValue = true
                    }
                }
            }
            //Caso valor de retirada estoure o saldo
            if (exceptedWithdrawValue) {
                res.status(200).json({ msg: "Não é possivel retirar este valor, saldo insuficiente" })
            } else {
                //Caso retirada tenha ocorrido sem problemas
                res.status(200).json({ saldos: clientAccount.balances })
            }

        }
        //Caso cliente não possua saldo/balanco na moeda escolhida
        else {
            res.status(400).json({ msg: `Cliente não possui saldo nesta moeda` })
        }

    }
}


module.exports = Controller;