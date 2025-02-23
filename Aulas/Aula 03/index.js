const express = require('express')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

const port = process.env.PORTA

const produtos = [
    {
        "nome":"PC",
        "preco": 2000
    }
]

app.get('/produtos', (requicisao, resposta) => {
  try {
    if(produtos.length === 0){
        return resposta.status(200).json({mensagem:"Banco de dados vazio"}) // javascript object notation
    }
    resposta.status(200).json(produtos)
  } catch (error) {
    resposta.status(500).json({mensagem:"Erro ao listar produtos!", erro: error.message})
  }

})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})