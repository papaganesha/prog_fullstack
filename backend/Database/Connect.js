const mysql = require('mysql');
const { json } = require('sequelize');
const util = require("util");
const { v4: uuidv4 } = require('uuid');


Persistence = {}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bancodigital'
});

connection.query = util.promisify(connection.query).bind(connection);

Persistence.connection = connection

Persistence.getClientsPersistence = async () => {
  connection.connect()
  var clients = []
  try {

    let queryString = `SELECT * from CLIENTES`;
    const results = await connection.query(queryString).catch(err => { throw err });
    connection.end();
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
  }
  catch (err) {
    throw err
  }
  return clients
}

Persistence.getClientByIdPersistence = async (id) => {
  connection.connect()
  let clientObj
  try {
    let queryString = `SELECT * FROM CLIENTES WHERE ID_CLIENTE = ?`
    const results = await connection.query(queryString, id).catch(err => { throw err });
    console.log(results)
    clientObj = {
      id: results[0].id_cliente,
      cpf: results[0].cpf,
      nome: results[0].nome,
      telefone: results[0].telefone,
      status: results[0].status == 0 ? "inativo" : "ativo"
    }

  }

  catch (err) {
    throw err
  }
  connection.end()
  return clientObj
}

Persistence.addClientPersistence = async (cpf, nome, telefone) => {
  var toReturn
  //Checar se cliente existe de acordo com o CPF
  //Criando string query
  let queryString = `SELECT 1 FROM CLIENTES A WHERE A.CPF = ?`
  //Executando query passando QueryString e parametros
  const checkIfClientExists = await connection.query(queryString, cpf).catch(err => { throw err })
  //Checar se usuario existe se resultado for 1
  console.log("AA =>" ,checkIfClientExists["1"])
  if (checkIfClientExists["1"] == 1) {
    //Caso usuario exista   
    toReturn = { status: false, msg: `Cliente com este cpf ja foi cadastrado` }
  }
  //Caso usuario não existir
  else {
    //Criar novo usuario/cliente
    //Criando novo ID
    var newId = uuidv4()
    //Criando Query String
    let queryString = "INSERT INTO CLIENTES (ID_CLIENTE, CPF, NOME, TELEFONE) VALUES (?, ?, ?, ?)";
    //Executando query passando QueryString e parametros 
    const insertClient = await connection.query(queryString, [newId, cpf, nome, telefone])
    .catch(err => {
        if (err.code == 'ER_DUP_ENTRY') {
          toReturn = { status: false, msg: `Cliente com este cpf ja foi cadastrado` }
        }
    })
    console.log(insertClient)
    //Checa se cliente foi inserido
    if (insertClient.affectedRows > 0) {
      toReturn = { status: true, msg: `Cliente ${nome} cadastrado com sucesso` }
    }
  }
  return toReturn
}



module.exports = Persistence