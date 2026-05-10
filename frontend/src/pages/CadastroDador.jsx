import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function CadastroDador() {
  const [formData, setFormData] = useState({
    cpf: '',
    faixa_idade: '',
    faixa_renda: '',
    biografia: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [categoriasSelectes, setCategoriasSelectes] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient.get('/categorias/').then(res => setCategorias(res.data.results || res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoriaChange = (catId) => {
    setCategoriasSelectes(
      categoriasSelectes.includes(catId)
        ? categoriasSelectes.filter(id => id !== catId)
        : [...categoriasSelectes, catId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/doadores/', {
        ...formData,
        categorias_doacao_ids: categoriasSelectes,
      });
      setMessage('Cadastro como doador criado com sucesso!');
      setFormData({ cpf: '', faixa_idade: '', faixa_renda: '', biografia: '' });
      setCategoriasSelectes([]);
    } catch (err) {
      setMessage('Erro ao criar cadastro. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Cadastro de Doador</h2>
      {message && <p style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <select name="faixa_idade" value={formData.faixa_idade} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="">Selecione faixa etária</option>
          <option value="18-25">18-25 anos</option>
          <option value="25-35">25-35 anos</option>
          <option value="35-50">35-50 anos</option>
          <option value="50+">50+ anos</option>
        </select>
        <select name="faixa_renda" value={formData.faixa_renda} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="">Selecione faixa de renda</option>
          <option value="0-1000">Até R$ 1.000</option>
          <option value="1000-3000">R$ 1.000 - R$ 3.000</option>
          <option value="3000-5000">R$ 3.000 - R$ 5.000</option>
          <option value="5000+">Acima de R$ 5.000</option>
        </select>
        <textarea
          name="biografia"
          placeholder="Biografia (opcional)"
          value={formData.biografia}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold' }}>Categorias que você doa:</label>
          {categorias.map(cat => (
            <div key={cat.id}>
              <input
                type="checkbox"
                id={`cat-${cat.id}`}
                checked={categoriasSelectes.includes(cat.id)}
                onChange={() => handleCategoriaChange(cat.id)}
              />
              <label htmlFor={`cat-${cat.id}`}>{cat.nome}</label>
            </div>
          ))}
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#FF9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
}
