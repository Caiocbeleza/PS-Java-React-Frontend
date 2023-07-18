import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import * as ReactBootstrap from 'react-bootstrap';

export default function Home() {
  const [transferencias, setTransferencias] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nomeOperador, setNome] = useState('');

  useEffect(() => {
    getTransferencias();
  }, []);

  const getTransferencias = async () => {
    try {
      const response = await axios.get("http://localhost:8080/transferencias");
      setTransferencias(response.data);
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getTransferencias();
  };

  return (
    <div className="app-container">
      <div className="filters-container">
        <h2>Informe os filtros:</h2>
        <form onSubmit={handleSubmit} className="filter-form">
          <div className="form-group">
            <label>Data inicial:</label>
            <input
              type="text"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Data final:</label>
            <input
              type="text"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Texto:</label>
            <input
              type="text"
              className="form-control"
              value={nomeOperador}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Filtrar</button>
        </form>
      </div>

      <div className="table-container">
        <h2>Tabela de Informações</h2>
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
