// pages/api/clientes/index.js
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nome, email } = req.body
    const cliente = await prisma.cliente.create({
      data: { nome, email },
    })
    
    return res.status(201).json(cliente)
  }

  if (req.method === 'GET') {
    const clientes = await prisma.cliente.findMany()
    return res.status(200).json(clientes)
  }

  res.status(405).end()
}
