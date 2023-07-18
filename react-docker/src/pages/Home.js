import React, { useState, useEffect} from "react";
import axios from "axios";
import * as ReactBootstrap from 'react-bootstrap';

export default function Home() {
  const [transferencias, setTransferencias] = useState([]);
  const [transferenciasTotal, setTransferenciasTotal] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nomeOperador, setNome] = useState(null);
  const [saldoTotal, setSaldoTotal] = useState('');
  const [saldoPeriodo, setSaldoPeriodo] = useState('');

  useEffect(() => {
    getTransferencias();
  }, []);

  useEffect(() => {
    getSaldoTotal(transferenciasTotal);
  }, [transferenciasTotal]);

  useEffect(() => {
    getSaldoPeriodo(transferencias);
  }, [transferencias]);



  const getTransferencias = async () => {
    try {
      const response = await axios.get("http://localhost:8080/transferencias");
      setTransferenciasTotal(response.data);
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
    }
  };

  const getSaldoTotal = async (transferenciasTotal) => {
    let soma = transferenciasTotal.reduce((a, b) => a + b.valor, 0);
    let fixed = soma.toFixed(2);
    setSaldoTotal(fixed);
  }

  const getSaldoPeriodo = async (transferencias) => {
    let soma = transferencias.reduce((a, b) => a + b.valor, 0);
    let fixed = soma.toFixed(2);
    setSaldoPeriodo(fixed);
  }


  const getTransferenciasFiltros = async () => {
    try {
      const response = await axios.get("http://localhost:8080/procurar-filtros",
      {
        params: {
            inicio: startDate,
            fim: endDate,
            nomeOperador: nomeOperador
        }
      });
      setTransferencias(response.data);
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getTransferenciasFiltros();
  };

  function formatDate(date){
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedDate = new Date(date).toLocaleDateString('en-US', options);

            // Split the formatted date into day, month, and year parts
            const [month, day, year] = formattedDate.split('/');

    return `${day}/${month}/${year}`;

  }

  return (
    <div className="app-container">
      <div className="filters-container">
        <h2>Visualizar Transações:</h2>
        <form onSubmit={handleSubmit} className="filter-form">
            <div className="form-row">
          <div className="col">
            <label>Data inicial:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Data Inicial"
            />
          </div>
          <div className="col">
            <label>Data final:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Data Final"
            />
          </div>
          <div className="col">
            <label>Nome:</label>
            <input
              type="text"
              className="form-control"
              value={nomeOperador}
              onChange={(e) => setNome(e.target.value === '' ? null : e.target.value)}
              placeholder="Nome do Operador"
            />
          </div>          
          <button type="submit" className="btn btn-outline-dark btn-lg">Buscar</button>
          </div>
        </form>
      </div>
      <ReactBootstrap.Container className='justify-content-left align-items-left'>
      <div className="card text-white bg-dark mb-3">
        <div className="card-body">
            <h5 className="card-title">Saldo</h5>
            <p className="card-text">Saldo Total: R${saldoTotal}</p>
            <p className="card-text">Saldo no Período: R${saldoPeriodo}</p>            
        </div>
      </div>
      </ReactBootstrap.Container>

      <div className="table-container">
        <ReactBootstrap.Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {transferencias.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.dt)}</td>
                <td>R${item.valor}</td>
                <td>{item.tipo}</td>
                <td>{item.nomeOperador}</td>
              </tr>
            ))}
          </tbody>
        </ReactBootstrap.Table>
      </div>
    </div>
  );
}
