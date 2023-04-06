const app = require('./App')
const dbConnection = require('./Database/Connect')

console.log('\n============================ Prog Fullstack ============================')

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server rodando na porta 3000 ✔️`)
})

