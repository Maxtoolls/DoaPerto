FormularioDoacao.js

// FormularioDoacao.js
import React, { useState } from 'react';

function FormularioDoacao() {
  const [item, setItem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Item "${item}" cadastrado com sucesso no DoaPerto!`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Nova Doação - DoaPerto</h2>
      <form onSubmit={handleSubmit}>
        <label>O que você quer doar?</label><br/>
        <input 
          type="text" 
          value={item} 
          onChange={(e) => setItem(e.target.value)} 
          placeholder="Ex: Cesta Básica"
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
          Cadastrar Doação
        </button>
      </form>
    </div>
  );
}

export default FormularioDoacao;