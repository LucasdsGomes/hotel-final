import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CrudClientes() {
  const router = useRouter();
  const [cliente, setCliente] = useState({ nome: "", email: "" });
  const [clientes, setClientes] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  // Carregar clientes ao iniciar
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    if (res.ok) setClientes(data);
  };

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const criarCliente = async () => {
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Cliente criado com sucesso!`);
      carregarClientes();
      setCliente({ nome: "", email: "" });
    } else {
      alert(`Erro: ${data.error || data.message}`);
    }
  };

  const editarCliente = (id) => {
    const clienteParaEditar = clientes.find((c) => c.id === id);
    setCliente({
      nome: clienteParaEditar.nome,
      email: clienteParaEditar.email,
    });
    setModoEdicao(true);
    setIdEdicao(id);
  };

  const atualizarCliente = async () => {
    const res = await fetch("/api/clientes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cliente, id: idEdicao }),
    });

    if (res.ok) {
      alert("Cliente atualizado com sucesso!");
      carregarClientes();
      cancelarEdicao();
    } else {
      const data = await res.json();
      alert(`Erro: ${data.error || data.message}`);
    }
  };

  const deletarCliente = async (id) => {
    if (confirm("Tem certeza que deseja excluir este cliente? O indivíduo pode ter reservas relacionadas.")) {
      const res = await fetch("/api/clientes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        alert("Cliente excluído com sucesso!");
        carregarClientes();
      } else {
        const data = await res.json();
        alert(`Erro: ${data.error || data.message}`);
      }
    }
  };

  const cancelarEdicao = () => {
    setCliente({ nome: "", email: "" });
    setModoEdicao(false);
    setIdEdicao(null);
  };

  return (
    <div className="container py-4">
      <Head>
        <title>CRUD Clientes</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Head>
      <button onClick={() => router.back()} className="btn btn-info mb-3">
        ← Voltar
      </button>

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">
            <i className="fas fa-users me-2"></i>
            CRUD Clientes
          </h1>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">
                    {modoEdicao ? "Editar Cliente" : "Novo Cliente"}
                  </h2>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={cliente.nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={cliente.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    {modoEdicao ? (
                      <>
                        <button
                          onClick={atualizarCliente}
                          className="btn btn-success flex-grow-1"
                        >
                          <i className="fas fa-save me-2"></i>
                          Atualizar
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          className="btn btn-secondary"
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={criarCliente}
                        className="btn btn-primary flex-grow-1"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Cadastrar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">Lista de Clientes</h2>
                </div>
                <div className="card-body p-0">
                  {clientes.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      Nenhum cliente cadastrado
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {clientes.map((cli) => (
                        <li
                          key={cli.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{cli.nome}</strong>
                            <div className="text-muted small">{cli.email}</div>
                          </div>
                          <div>
                            <button
                              onClick={() => editarCliente(cli.id)}
                              className="btn btn-sm btn-outline-primary me-2"
                              title="Editar"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => deletarCliente(cli.id)}
                              className="btn btn-sm btn-outline-danger"
                              title="Excluir"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
