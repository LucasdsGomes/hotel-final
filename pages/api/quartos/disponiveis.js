import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { dataInicio, dataFim } = req.query;

  if (!dataInicio || !dataFim) {
    return res.status(400).json({ erro: 'Datas são obrigatórias.' });
  }

  const inicioDate = new Date(dataInicio);
  const fimDate = new Date(dataFim);

  try {
    const quartosIndisponiveis = await prisma.reserva.findMany({
      where: {
        OR: [
          {
            dataInicio: { lte: fimDate },
            dataFim: { gte: inicioDate },
          }
        ]
      },
      select: { quartoId: true }
    });

    const idsIndisponiveis = quartosIndisponiveis.map(r => r.quartoId);

    const quartosDisponiveis = await prisma.quarto.findMany({
      where: {
        id: { notIn: idsIndisponiveis }
      }
    });

    res.status(200).json(quartosDisponiveis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar quartos disponíveis.' });
  }
}
