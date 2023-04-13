const mysql = require('mysql');

Connection = {}
Connection.connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bancodigital'
});



 Connection.connection.connect()

// var cpf = "04533287654"
// connection.query(`SELECT * FROM CLIENTES A WHERE A.CPF = ?`, cpf, function (error, results, fields) {
//     if (error){
//         //throw error
//         console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
//     };
//     console.log('The solution is: ', results[0]);
//   });

//ADICIONANDO NOVO CLIENTE

// connection.query(`INSERT INTO clientes (cpf, nome, telefone) VALUES ('04533287654', 'Bruno Marques', '51998453221')`, function (error, results, fields) {
//     //Caso de entrada duplicada, CPF ja existente
//     if (error.code == "ER_DUP_ENTRY"){
//         console.log(`Error code: ${error.code} -Error nbr: ${error.errno} - Error message: ${error.sqlMessage}`)
//     };
//     //Caso insercao ocorra
//     console.log('The solution is: ', results[0]);
//   });

// Inserindo saldo na conta
// var id_cliente = 6
// var moeda = "BRL"
// var saldo = 150.45
//   connection.query(`INSERT INTO contas (id_cliente, moeda, saldo) VALUES (?, ?, ?)`,[id_cliente, moeda, saldo], function (error, results, fields) {
//     //Caso de entrada duplicada, CPF ja existente
//     if (error.code == 1062){
//         console.log(`Moeda ja registrada para usuario`)
//     };
//     //Caso insercao ocorra
//     if(results.affectedRows > 0){
//         console.log('Conta de cliente criada com sucesso');
//     }
    
//   });
   
  // connection.end();

  module.exports = Connection