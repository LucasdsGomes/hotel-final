import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleSearch = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Por favor, selecione ambas as datas");
      return;
    }
    setShowOptions(true);
  };

  const handleReset = () => {
    setCheckInDate("");
    setCheckOutDate("");
    setShowOptions(false);
  };

  return (
    <div className="container py-4">
      <Head>
        <title>Hotelaria - Painel de Controle</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Head>

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h1 className="h4 mb-0">
            <i className="fas fa-hotel me-2"></i>
            Hotelaria - Painel de Controle
          </h1>
        </div>

        <div className="card-body">
          {/* Seção de Check-in/Check-out */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Check-in / Check-out
              </h2>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Data de Check-in</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Data de Check-out</label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  onClick={handleSearch}
                  className="btn btn-primary flex-grow-1"
                  disabled={!checkInDate || !checkOutDate}
                >
                  <i className="fas fa-search me-2"></i>
                  Verificar Disponibilidade
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-times me-2"></i>
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* Opções após seleção de datas */}
          {showOptions && (
            <div className="card mb-4 border-success">
              <div className="card-header bg-success text-white">
                <h2 className="h5 mb-0">
                  <i className="fas fa-check-circle me-2"></i>
                  Opções Disponíveis
                </h2>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  Período selecionado: {new Date(checkInDate).toLocaleDateString()} a {new Date(checkOutDate).toLocaleDateString()}
                </div>

                <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                  <button
                    onClick={() => router.push('/components/crudReservas')}
                    className="btn btn-primary px-4 py-3 shadow-sm"
                  >
                    <i className="fas fa-calendar-plus fa-2x mb-2"></i>
                    <div>Nova Reserva</div>
                    <small className="d-block">Para este período</small>
                  </button>

                  <button
                    onClick={() => router.push('/components/crudQuartos')}
                    className="btn btn-info px-4 py-3 shadow-sm"
                  >
                    <i className="fas fa-bed fa-2x mb-2"></i>
                    <div>Ver Quartos</div>
                    <small className="d-block">Disponíveis</small>
                  </button>

                  <button
                    onClick={() => router.push('/components/crudCliente')}
                    className="btn btn-success px-4 py-3 shadow-sm"
                  >
                    <i className="fas fa-user-plus fa-2x mb-2"></i>
                    <div>Cadastrar</div>
                    <small className="d-block">Novo Cliente</small>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu principal */}
          <div className="card">
            <div className="card-header bg-light">
              <h2 className="h5 mb-0">
                <i className="fas fa-bars me-2"></i>
                Menu Principal
              </h2>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <button
                  onClick={() => router.push('/components/crudCliente')}
                  className="btn btn-outline-success px-4 py-2"
                >
                  <i className="fas fa-users me-2"></i>Clientes
                </button>
                <button
                  onClick={() => router.push('/components/crudQuartos')}
                  className="btn btn-outline-primary px-4 py-2"
                >
                  <i className="fas fa-bed me-2"></i>Quartos
                </button>
                <button
                  onClick={() => router.push('/components/crudReservas')}
                  className="btn btn-outline-info px-4 py-2"
                >
                  <i className="fas fa-calendar-check me-2"></i>Reservas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}