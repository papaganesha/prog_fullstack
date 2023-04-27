const mysql = require('mysql');
const util = require("util");

Persistence = {}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bancodigital'
});

connection.query = util.promisify(connection.query).bind(connection);


Persistence.getAllClients = async () => {
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

Persistence.getClientById = async (id) => {
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



module.exports = Persistence