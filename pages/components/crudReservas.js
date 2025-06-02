import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CrudReservas() {
  const router = useRouter();
  const [reserva, setReserva] = useState({
    clienteId: "",
    quartoId: "",
    dataInicio: "",
    dataFim: "",
  });
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [quartosDisponiveis, setQuartosDisponiveis] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const [resClientes, resQuartos, resReservas] = await Promise.all([
        fetch("/api/clientes"),
        fetch("/api/quartos"),
        fetch("/api/reservas"),
      ]);

      if (resClientes.ok) setClientes(await resClientes.json());
      if (resQuartos.ok) setQuartos(await resQuartos.json());
      if (resReservas.ok) setReservas(await resReservas.json());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const criarReserva = async () => {
    if (
      !reserva.clienteId ||
      !reserva.quartoId ||
      !reserva.dataInicio ||
      !reserva.dataFim
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar reserva");
      }

      alert("Reserva criada com sucesso!");
      setReservas([...reservas, data]);
      setReserva({
        clienteId: "",
        quartoId: "",
        dataInicio: "",
        dataFim: "",
      });
      setQuartosDisponiveis([]);
      carregarDadosIniciais();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const editarReserva = (id) => {
    const reservaParaEditar = reservas.find((r) => r.id === id);
    setReserva({
      clienteId: reservaParaEditar.clienteId,
      quartoId: reservaParaEditar.quartoId,
      dataInicio: reservaParaEditar.dataInicio.split("T")[0],
      dataFim: reservaParaEditar.dataFim.split("T")[0],
    });
    setModoEdicao(true);
    setIdEdicao(id);
  };

  const atualizarReserva = async () => {
    try {
      const res = await fetch("/api/reservas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reserva, id: idEdicao }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar reserva");
      }

      alert("Reserva atualizada com sucesso!");
      carregarDadosIniciais();
      cancelarEdicao();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const deletarReserva = async (id) => {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
      try {
        const res = await fetch("/api/reservas", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao cancelar reserva");
        }

        alert("Reserva cancelada com sucesso!");
        carregarDadosIniciais();
      } catch (error) {
        alert(error.message);
        console.error(error);
      }
    }
  };

  const cancelarEdicao = () => {
    setReserva({
      clienteId: "",
      quartoId: "",
      dataInicio: "",
      dataFim: "",
    });
    setModoEdicao(false);
    setIdEdicao(null);
    setQuartosDisponiveis([]);
  };

  return (
    <div className="container py-4">
      <Head>
        <title>CRUD Reservas</title>
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
        <i className="fas fa-arrow-left me-2"></i>
        Voltar
      </button>

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">
            <i className="fas fa-calendar-check me-2"></i>
            CRUD Reservas
          </h1>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">
                    {modoEdicao ? "Editar Reserva" : "Nova Reserva"}
                  </h2>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <select
                      className="form-select"
                      name="clienteId"
                      value={reserva.clienteId}
                      onChange={handleChange}
                    >
                      <option value="">Selecione o Cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quarto</label>
                    <select
                      className="form-select"
                      name="quartoId"
                      value={reserva.quartoId}
                      onChange={handleChange}
                    >
                      <option value="">Selecione o Quarto</option>
                      {quartos.map((q) => (
                        <option key={q.id} value={q.id}>
                          Quarto {q.numero} - {q.tipo} (R$ {q.preco?.toFixed(2)}
                          )
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Data de Check-in</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dataInicio"
                        value={reserva.dataInicio}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Data de Check-out</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dataFim"
                        value={reserva.dataFim}
                        onChange={handleChange}
                        min={
                          reserva.dataInicio ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    {modoEdicao ? (
                      <>
                        <button
                          onClick={atualizarReserva}
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
                        onClick={criarReserva}
                        className="btn btn-primary flex-grow-1"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Reservar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">Lista de Reservas</h2>
                </div>
                <div className="card-body p-0">
                  {reservas.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      Nenhuma reserva cadastrada
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {reservas.map((r) => (
                        <li key={r.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">
                                <strong>{r.cliente?.nome}</strong>
                              </h6>
                              <div className="mb-1">
                                Quarto {r.quarto?.numero} ({r.quarto?.tipo})
                              </div>
                              <small className="text-muted">
                                {new Date(r.dataInicio).toLocaleDateString()} a{" "}
                                {new Date(r.dataFim).toLocaleDateString()}
                              </small>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => editarReserva(r.id)}
                                className="btn btn-sm btn-outline-primary"
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => deletarReserva(r.id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Cancelar"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
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
