const { Sequelize, DataTypes } = require('sequelize');


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('bancodigital', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


const auth = async () => {
    var authentication
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    return authentication
}


const Client = sequelize.define('cliente', {
    // Model attributes are defined here
    id_cliente: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    // Other model options go here
    tableName: 'clientes'
});

// `sequelize.define` also returns the model
console.log(sequelize.models.User); // true

// Client.drop();
// (async () => {
//     await sequelize.sync({ force: true });
//     //Criando cliente novo
//     console.log("The table for the User model was just (re)created!");
//     const jane = Client.build({ cpf:"03744728033" ,nome: "Jane", telefone: "51998192333"});
//     console.log(jane instanceof Client); // true
//     console.log(jane.nome); // "Jane"
//     await jane.save();
//     console.log('Jane was saved to the database!');
// })();
