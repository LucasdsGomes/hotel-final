import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function CrudQuartos() {
  const router = useRouter();
  const [quarto, setQuarto] = useState({ numero: "", tipo: "", preco: "" });
  const [quartos, setQuartos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);

  useEffect(() => {
    carregarQuartos();
  }, []);

  const carregarQuartos = async () => {
    const res = await fetch("/api/quartos");
    const data = await res.json();
    if (res.ok) setQuartos(data);
  };

  const handleChange = (e) => {
    setQuarto({ ...quarto, [e.target.name]: e.target.value });
  };

  const criarQuarto = async () => {
    try {
      const res = await fetch("/api/quartos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: parseInt(quarto.numero),
          tipo: quarto.tipo,
          preco: parseFloat(quarto.preco),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar quarto");
      }

      setQuartos((prev) => [...prev, data]);
      setQuarto({ numero: "", tipo: "", preco: "" });
      alert("Quarto criado com sucesso!");
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const editarQuarto = (id) => {
    const quartoParaEditar = quartos.find((q) => q.id === id);
    setQuarto({
      numero: quartoParaEditar.numero.toString(),
      tipo: quartoParaEditar.tipo,
      preco: quartoParaEditar.preco.toString(),
    });
    setModoEdicao(true);
    setIdEdicao(id);
  };

  const atualizarQuarto = async () => {
    try {
      const res = await fetch("/api/quartos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idEdicao,
          numero: parseInt(quarto.numero),
          tipo: quarto.tipo,
          preco: parseFloat(quarto.preco),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar quarto");
      }

      alert("Quarto atualizado com sucesso!");
      carregarQuartos();
      cancelarEdicao();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const deletarQuarto = async (id) => {
    if (confirm("Tem certeza que deseja excluir este quarto?")) {
      try {
        const res = await fetch("/api/quartos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao excluir quarto");
        }

        alert("Quarto excluído com sucesso!");
        carregarQuartos();
      } catch (error) {
        alert(error.message);
        console.error(error);
      }
    }
  };

  const cancelarEdicao = () => {
    setQuarto({ numero: "", tipo: "", preco: "" });
    setModoEdicao(false);
    setIdEdicao(null);
  };

  return (
    <div className="container py-4">
      <Head>
        <title>CRUD Quartos</title>
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
            <i className="fas fa-bed me-2"></i>
            CRUD Quartos
          </h1>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">
                    {modoEdicao ? "Editar Quarto" : "Novo Quarto"}
                  </h2>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Número do Quarto</label>
                    <input
                      type="number"
                      className="form-control"
                      name="numero"
                      value={quarto.numero}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tipo de Quarto</label>
                    <select
                      className="form-select"
                      name="tipo"
                      value={quarto.tipo}
                      onChange={handleChange}
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suíte">Suíte</option>
                      <option value="Suíte Presidencial">
                        Suíte Presidencial
                      </option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Preço por Noite (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="preco"
                      value={quarto.preco}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="d-flex gap-2">
                    {modoEdicao ? (
                      <>
                        <button
                          onClick={atualizarQuarto}
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
                        onClick={criarQuarto}
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
                  <h2 className="h5 mb-0">Lista de Quartos</h2>
                </div>
                <div className="card-body p-0">
                  {quartos.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      Nenhum quarto cadastrado
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {quartos.map((qua) => (
                        <li
                          key={qua.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>Quarto {qua.numero}</strong>
                            <div className="text-muted small">
                              Tipo: {qua.tipo}
                            </div>
                            <div className="text-muted small">
                              Preço: R$ {qua.preco?.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => editarQuarto(qua.id)}
                              className="btn btn-sm btn-outline-primary me-2"
                              title="Editar"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => deletarQuarto(qua.id)}
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
