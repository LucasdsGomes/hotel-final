// pages/api/quartos/index.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { numero, tipo, preco } = req.body;

    const room = await prisma.Quarto.findUnique({
      where: { numero },
    });

    if (room) {
      console.error("Quarto já existente");
      return res.status(409).json({ error: "Quarto já está em uso" });
    }

    const quarto = await prisma.Quarto.create({
      data: { numero, tipo, preco },
    });
    return res.status(201).json(quarto);
  } else if (req.method === "GET") {
    const quartos = await prisma.Quarto.findMany();
    return res.status(200).json(quartos);
  } else if (req.method === "PUT") {
    try {
      const { id, numero, tipo, preco } = req.body;

      if (!id || !numero || !tipo || !preco) {
        return res
          .status(400)
          .json({ error: "ID, Número, Tipo e Preço são obrigatórios" });
      }

      const quartoAtualizado = await prisma.quarto.update({
        where: { id: parseInt(id) },
        data: { numero, tipo, preco },
      });

      return res.status(200).json(quartoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar o quarto:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "ID é obrigatório para deletar um quarto" });
      }

      await prisma.reserva.deleteMany({
        where: {
          quartoId: parseInt(id),
        },
      });

      await prisma.quarto.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json({ message: "Quarto deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar o quarto:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}

//res.status(405).end()
