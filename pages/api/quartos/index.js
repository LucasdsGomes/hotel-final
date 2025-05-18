// pages/api/quartos/index.js
import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { numero, tipo, preco } = req.body
    const quarto = await prisma.quarto.create({
      data: { numero, tipo, preco },
    })
    return res.status(201).json(quarto)
  }

  if (req.method === 'GET') {
    const quartos = await prisma.quarto.findMany()
    return res.status(200).json(quartos)
  }

  res.status(405).end()
}
