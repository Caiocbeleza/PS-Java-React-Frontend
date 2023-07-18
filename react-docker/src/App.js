import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('URL_DA_API_AQUI');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div>
      <h2>Informe os filtros:</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Data inicial:
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Data final:
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Texto:
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </label>
        <button type="submit">Filtrar</button>
      </form>

      <h2>Tabela de Informações</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.data}</td>
              <td>{item.valor}</td>
              <td>{item.tipo}</td>
              <td>{item.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
