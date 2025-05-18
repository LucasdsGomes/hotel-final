import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { clienteId, quartoId, dataInicio, dataFim } = req.body

    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)

    // Verificar conflitos de reserva para o mesmo quarto
    const conflito = await prisma.reserva.findFirst({
      where: {
        quartoId: quartoId,
        AND: [
          { dataInicio: { lt: fim } },
          { dataFim: { gt: inicio } }
        ]
      }
    })

    if (conflito) {
      return res.status(400).json({ error: 'Este quarto já está reservado neste período.' })
    }

    // Criar a reserva se não houver conflito
    const reserva = await prisma.reserva.create({
      data: {
        clienteId,
        quartoId,
        dataInicio: inicio,
        dataFim: fim,
      },
    })

    return res.status(201).json(reserva)
  }

  if (req.method === 'GET') {
    const reservas = await prisma.reserva.findMany({
      include: { cliente: true, quarto: true },
    })
    return res.status(200).json(reservas)
  }

  res.status(405).end()
}
