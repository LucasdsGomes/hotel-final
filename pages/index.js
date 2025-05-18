import { useState, useEffect } from 'react'

export default function Home() {
  const [clientes, setClientes] = useState([])
  const [quartos, setQuartos] = useState([])
  const [reservas, setReservas] = useState([])
  const [quartosDisponiveis, setQuartosDisponiveis] = useState([])

  const [clienteNome, setClienteNome] = useState('')
  const [clienteEmail, setClienteEmail] = useState('')
  const [quartoNumero, setQuartoNumero] = useState('')
  const [quartoTipo, setQuartoTipo] = useState('')
  const [quartoPreco, setQuartoPreco] = useState('')
  const [reservaCliente, setReservaCliente] = useState('')
  const [reservaQuarto, setReservaQuarto] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  useEffect(() => {
    fetch('/api/clientes').then(res => res.json()).then(setClientes)
    fetch('/api/quartos').then(res => res.json()).then(setQuartos)
    fetch('/api/reservas').then(res => res.json()).then(setReservas)
  }, [])

  const criarCliente = async () => {
  const res = await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: clienteNome, email: clienteEmail })
  })

  const data = await res.json()

  if (res.ok) {
    // Mostra os dados do cliente criado
    alert(`Cliente criado com sucesso:\n${JSON.stringify(data, null, 2)}`)

    // Atualiza lista sem novo fetch
    setClientes(prev => [...prev, data])
  } else {
    alert(`Erro ao criar cliente:\n${data.error || data.message}`)
  }

  setClienteNome('')
  setClienteEmail('')
}

  const criarQuarto = async () => {
    await fetch('/api/quartos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero: parseInt(quartoNumero), tipo: quartoTipo, preco: parseFloat(quartoPreco) })
    })
    setQuartoNumero('')
    setQuartoTipo('')
    setQuartoPreco('')
    const data = await fetch('/api/quartos').then(res => res.json())
    setQuartos(data)
  }

  const criarReserva = async () => {
    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId: parseInt(reservaCliente),
        quartoId: parseInt(reservaQuarto),
        dataInicio,
        dataFim
      })
    })

    if (!res.ok) {
      const err = await res.json()
      alert(err.error || 'Erro ao reservar')
      return
    }

    setDataInicio('')
    setDataFim('')
    setReservaCliente('')
    setReservaQuarto('')
    const data = await fetch('/api/reservas').then(res => res.json())
    setReservas(data)
  }

  const buscarQuartosDisponiveis = async () => {
    if (!dataInicio || !dataFim) {
      alert('Preencha data de início e fim!')
      return
    }

    const res = await fetch(`/api/quartos/disponiveis?dataInicio=${dataInicio}&dataFim=${dataFim}`)
    const data = await res.json()
    setQuartosDisponiveis(data)
  }

  return (
  <div className="container">
    <h1>Hotelaria - Painel de Controle</h1>

    <div className="card">
      <h2>Cadastrar Cliente</h2>
      <input placeholder="Nome" value={clienteNome} onChange={e => setClienteNome(e.target.value)} />
      <input placeholder="Email" value={clienteEmail} onChange={e => setClienteEmail(e.target.value)} />
      <button onClick={criarCliente}>Salvar Cliente</button>
    </div>

    <div className="card">
      <h2>Cadastrar Quarto</h2>
      <input placeholder="Número" value={quartoNumero} onChange={e => setQuartoNumero(e.target.value)} />
      <input placeholder="Tipo (ex: Suíte)" value={quartoTipo} onChange={e => setQuartoTipo(e.target.value)} />
      <input placeholder="Preço" value={quartoPreco} onChange={e => setQuartoPreco(e.target.value)} />
      <button onClick={criarQuarto}>Salvar Quarto</button>
    </div>

    <div className="card">
      <h2>Fazer Reserva</h2>
      <select value={reservaCliente} onChange={e => setReservaCliente(e.target.value)}>
        <option value="">Selecione o Cliente</option>
        {clientes.map(c => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <select value={reservaQuarto} onChange={e => setReservaQuarto(e.target.value)}>
        <option value="">Selecione o Quarto</option>
        {quartos.map(q => (
          <option key={q.id} value={q.id}>Quarto {q.numero} - {q.tipo}</option>
        ))}
      </select>

      <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
      <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
      <button onClick={criarReserva}>Salvar Reserva</button>
    </div>
    
    <div className="card">
      <h2>Consultar Quartos Disponíveis</h2>
      <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
      <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
      <button onClick={buscarQuartosDisponiveis}>Buscar Disponíveis</button>

      <ul>
        {quartosDisponiveis.length > 0 ? (
          quartosDisponiveis.map(q => (
            <li key={q.id}>
              Quarto {q.numero} - {q.tipo} - R$ {q.preco.toFixed(2)}
            </li>
          ))
        ) : (
          <p>Nenhum quarto disponível neste período.</p>
        )}
      </ul>
    </div>

    <div className="card">
      <h2>Reservas</h2>
      <ul>
        {reservas.map(r => (
          <li key={r.id}>
            <strong>{r.cliente.nome}</strong> reservou o quarto {r.quarto.numero} ({r.quarto.tipo})<br />
            de <em>{new Date(r.dataInicio).toLocaleDateString()}</em> até <em>{new Date(r.dataFim).toLocaleDateString()}</em>
          </li>
        ))}
      </ul>
    </div>
    <div className='card'>

        <p>* Criar Menus de acesso /clientes /quartos / reservas.</p>
        <p>* Criar CRUD de clientes.</p>
        <p>* Criar CRUD de quartos.</p>
        <p>* Criar CRUD de reservas.</p>
        <p>* Criar Opções Check-in / Check-out com as datas.</p>
        

    </div>


    <style jsx>{`
      .container {
        padding: 40px;
        font-family: 'Segoe UI', sans-serif;
        background: #f8f9fa;
        max-width: 900px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        color: #333;
      }

      .card {
        background: white;
        padding: 20px;
        margin-bottom: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      input, select {
        display: block;
        margin-bottom: 10px;
        padding: 8px;
        width: 100%;
        max-width: 300px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      button {
        padding: 10px 20px;
        background-color: #0070f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }

      button:hover {
        background-color: #005bb5;
      }

      ul {
        margin-top: 10px;
        padding-left: 20px;
      }

      li {
        margin-bottom: 10px;
      }
    `}</style>
  </div>
  
)

}
