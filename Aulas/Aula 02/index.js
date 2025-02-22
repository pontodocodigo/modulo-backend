// importando express(commonjs)
const express = require('express')

// instanciando minha aplicação
const app = express()

// porta da aplicação
const port = 3000


app.get('/aluno', (requisicao, resposta) => {
  resposta.send('Aqui estão os alunos')
})

app.get('/professor', (requisicao, resposta) => {
  resposta.send('Aqui estão os professores')
})

app.listen(port, () => {
  console.log(`Servidor em execução http://localhost:${port}`)
})