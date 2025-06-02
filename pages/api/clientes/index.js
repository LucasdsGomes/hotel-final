import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nome, email } = req.body;

      if (!nome || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios" });
      }

      const user = await prisma.Cliente.findUnique({
        where: { email },
      });

      if (user) {
        console.error("Email já existente");
        return res.status(409).json({ error: "Email já está em uso" });
      }

      const cliente = await prisma.Cliente.create({
        data: { nome, email },
      });

      return res.status(201).json(cliente);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else if (req.method === "GET") {
    const clientes = await prisma.Cliente.findMany();
    return res.status(200).json(clientes);
  } else if (req.method === "PUT") {
    try {
      const { id, nome, email } = req.body;

      if (!id || !nome || !email) {
        return res
          .status(400)
          .json({ error: "ID, nome e email são obrigatórios" });
      }

      const clienteAtualizado = await prisma.Cliente.update({
        where: { id: parseInt(id) },
        data: { nome, email },
      });

      return res.status(200).json(clienteAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "ID é obrigatório para deletar um cliente" });
      }

      // Desta forma ou cascade no prisma.
      await prisma.reserva.deleteMany({
        where: {
          clienteId: parseInt(id),
        },
      });

      await prisma.cliente.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(200).json({ message: "Cliente deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  } else {
    return res.status(405).json({ error: "Método não permitido" });
  }
}
