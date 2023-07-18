import React, { useState, useEffect} from "react";
import axios from "axios";
import * as ReactBootstrap from 'react-bootstrap';

export default function Home() {
  const [transferencias, setTransferencias] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nomeOperador, setNome] = useState('');
  const [saldoTotal, setSaldoTotal] = useState('');

  useEffect(() => {
    getTransferencias();
  }, []);

  useEffect(() => {
    getSaldoTotal(transferencias);
  }, [transferencias]);




  const getTransferencias = async () => {
    try {
      const response = await axios.get("http://localhost:8080/transferencias");
      setTransferencias(response.data);
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
    }
  };

  const getSaldoTotal = async (transferencias) => {
    let soma = transferencias.reduce((a, b) => a + b.valor, 0);
    setSaldoTotal(soma);
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
              onChange={(e) => setNome(e.target.value)}
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
            <p className="card-text">Saldo Total: R$ {saldoTotal}</p>
            <p className="card-text">Saldo no Período: R$</p>            
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
                <td>{item.dt}</td>
                <td>{item.valor}</td>
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
