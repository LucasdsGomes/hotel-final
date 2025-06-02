import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { clienteId, quartoId, dataInicio, dataFim } = req.body;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    const conflito = await prisma.reserva.findFirst({
      where: {
        quartoId: parseInt(quartoId),
        AND: [{ dataInicio: { lt: fim } }, { dataFim: { gt: inicio } }],
      },
    });

    if (conflito) {
      return res
        .status(400)
        .json({ error: "Este quarto já está reservado neste período." });
    }

    const reserva = await prisma.reserva.create({
      data: {
        clienteId: parseInt(clienteId),
        quartoId: parseInt(quartoId),
        dataInicio: inicio,
        dataFim: fim,
      },
    });

    return res.status(201).json(reserva);
  } else if (req.method === "GET") {
    const reservas = await prisma.reserva.findMany({
      include: { cliente: true, quarto: true },
    });
    return res.status(200).json(reservas);
  } else if (req.method === "PUT") {
    try {
      const { id, clienteId, quartoId, dataInicio, dataFim } = req.body;

      if (!id || !clienteId || !quartoId || !dataInicio || !dataFim) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      const conflito = await prisma.reserva.findFirst({
        where: {
          id: { not: parseInt(id) },
          quartoId: parseInt(quartoId),
          AND: [{ dataInicio: { lt: fim } }, { dataFim: { gt: inicio } }],
        },
      });

      if (conflito) {
        return res
          .status(400)
          .json({ error: "Este quarto já está reservado neste período." });
      }

      const reservaAtualizada = await prisma.reserva.update({
        where: { id: parseInt(id) },
        data: {
          clienteId: parseInt(clienteId),
          quartoId: parseInt(quartoId),
          dataInicio: inicio,
          dataFim: fim,
        },
      });

      return res.status(200).json(reservaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "ID é obrigatório para deletar uma reserva" });
      }

      await prisma.reserva.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Reserva deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar reserva:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}
