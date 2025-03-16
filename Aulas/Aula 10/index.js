const express = require('express')
const dotenv = require('dotenv')
const { pool } = require('./src/config/conexao')
const app = express()

// middleware informando que o express como json
app.use(express.json())
dotenv.config()

const port = process.env.PORTA

// Rota para listar os produtos
app.get('/produtos', async (requicisao, resposta) => {
  try {
    const consulta = `select * from produto`
    const produtos = await pool.query(consulta) 
    if ( produtos.rows.length === 0) {
      return resposta.status(200).json({ mensagem: "Banco de dados vazio" }) 
    }
    resposta.status(200).json(produtos.rows)
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao listar produtos!", erro: error.message })
  }
})

// Rota para criar um produto
app.post('/produtos', async (requisicao, resposta) => {
  try {
    const { nome, preco } = requisicao.body
    const novoProduto = [ nome, preco ]
    const consulta = `insert into produto(nome, preco) values($1, $2)`
    await pool.query(consulta, novoProduto)
    resposta.status(201).json({ mensagem: "Produto criado com sucesso!" })
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao cadastrar produtos!", erro: error.message })
  }
})

// Rota para listar pelo id
// http://localhost:3000/produto/1
app.get('/produto/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id
    const consulta = `select * from produto where id = $1`
    const produto = await pool.query(consulta, [id])
    if (!produto) {
      return resposta.status(404).json({ mensagem: "Produto não encontrado!" })
    }
    resposta.status(200).json(produto.rows)
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao buscar produto!", erro: error.message })
  }
})

// Rota para deletar pelo id
// http://localhost:3000/produto/1
app.delete('/produto/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id
    const consulta = `delete from produto where id = $1 returning *`
    const produto = await pool.query(consulta, [id] )
    if( produto.rowCount === 0){
      return resposta.status(404).json({mensagem:"Produto não encontrado!"})
    }
    resposta.status(200).json({mensagem:"Produto excluido com sucesso!"})
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao excluir produto!", erro: error.message })
  }
})

// Deletar todos
// http://localhost:3000/produtos
app.delete('/produtos', async (requisicao, resposta) => {
  try {
    const consulta = `delete from produto`
    await pool.query(consulta)
    resposta.status(200).json({mensagem: "Todos os produtos foram excluidos!"})
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao excluir todos os produtos!", erro: error.message })
  }
})

// Buscar por nome
// http://localhost:3000/produtos/orefrigerantes
app.get('/produto/nome/:nome', async (requisicao, resposta) => {
  try {
    const nome = requisicao.params.nome.toLowerCase()
    const consulta = `select * from produto where lower(nome) like ($1)`
    const produto = await pool.query(consulta, [`%${nome}%`] )
    if(produto.rows.length === 0){
      return resposta.status(404).json({mensagem:"Produto não encontrado!"})
    }
    resposta.status(200).json(produto.rows)
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao excluir todos os produtos!", erro: error.message })
  }
})

// Editar produto pelo ID
// http://localhost:3000/produtos/1
app.put('/produto/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id
    const { nome, preco } = requisicao.body
    if(!nome || !preco){
      return resposta.status(400).json({mensagem: "Todos os campos devem ser preenchidos!"})
    }
    const consulta = `select * from produto where id = $1`
    const produto = await pool.query(consulta, [id])
    if(!produto){
      return resposta.status(404).json({mensagem: "Produto não encontrado!"})
    }
    const dados = [nome, preco, id]
    const consultaEditar = `update produto set nome = $1, preco = $2 where id = $3`
    await pool.query(consultaEditar, dados)
    resposta.status(200).json({mensagem: "Produto alterado com sucesso!"})
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao editar o produto!", erro: error.message })
  }
})

// Editar produto pelo ID
// http://localhost:3000/produtos/1
app.patch('/produto/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id
    const { nome, preco } = requisicao.body
    const consulta = `select * from produto where id = $1`
    const produto = await pool.query(consulta, [id])
    if(!produto){
      return resposta.status(404).json({mensagem: "Produto não encontrado!"})
    }
    const dados = [nome, preco, id]
    const consultaEditar = `update produto set nome = coalesce($1, nome), preco = coalesce($2, preco) where id = $3`
    await pool.query(consultaEditar, dados)
    resposta.status(200).json({mensagem: "Produto alterado com sucesso!"})
  } catch (error) {
    resposta.status(500).json({ mensagem: "Erro ao editar o produto!", erro: error.message })
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})