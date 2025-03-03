const express = require('express')
const dotenv = require('dotenv')
const app = express()

// middleware informando que o express como json
app.use(express.json())
dotenv.config()

const port = process.env.PORTA

const produtos = []

// Rota para listar os produtos
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

// Rota para criar um produto
app.post('/produtos', (requisicao, resposta) => {
  try {
    const { id, nome, preco } = requisicao.body
    const novoProduto = { id, nome, preco }
    const produtoExiste = produtos.some( produto => produto.id === id )
    if(produtoExiste){
      return resposta.status(200).json({mensagem: "Esse produto com esse id já existe!"})
    }
    produtos.push(novoProduto)
    resposta.status(201).json({mensagem: "Produto criado com sucesso!"})
  } catch (error) {
    resposta.status(500).json({mensagem:"Erro ao cadastrar produtos!", erro: error.message})
  }
})

// Rota para listar pelo id
// http://localhost:3000/produto/1
app.get('/produto/:id',  (requisicao, resposta) => {
  const id = requisicao.params.id
  const produto = produtos.find(produto => produto.id === id)
  if(!produto){
    return resposta.status(404).json({mensagem: "Produto não encontrado!"})
  }
  resposta.status(200).json(produto)
})


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})