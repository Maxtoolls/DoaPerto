import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function CadastroReceptor() {
  const [formData, setFormData] = useState({
    tipo: 'pessoa',
    cnpj: '',
    responsavel: '',
    telefone_contato: '',
    publico_atendido: '',
    disponibilidade_retirada: false,
    sobre: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [categoriasSelectes, setCategoriasSelectes] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient.get('/categorias/').then(res => setCategorias(res.data.results || res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
      await apiClient.post('/receptores/', {
        ...formData,
        tipos_item_aceitos_ids: categoriasSelectes,
      });
      setMessage('Cadastro como receptor criado com sucesso!');
      setFormData({
        tipo: 'pessoa',
        cnpj: '',
        responsavel: '',
        telefone_contato: '',
        publico_atendido: '',
        disponibilidade_retirada: false,
        sobre: '',
      });
      setCategoriasSelectes([]);
    } catch (err) {
      setMessage('Erro ao criar cadastro. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Cadastro de Receptor</h2>
      {message && <p style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="pessoa">Pessoa Física</option>
          <option value="ong">ONG</option>
          <option value="igreja">Igreja</option>
          <option value="escola">Escola</option>
          <option value="reciclagem">Ponto de Reciclagem</option>
        </select>
        {formData.tipo !== 'pessoa' && (
          <input
            type="text"
            name="cnpj"
            placeholder="CNPJ"
            value={formData.cnpj}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        )}
        <input
          type="text"
          name="responsavel"
          placeholder="Nome do responsável"
          value={formData.responsavel}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="tel"
          name="telefone_contato"
          placeholder="Telefone"
          value={formData.telefone_contato}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <textarea
          name="publico_atendido"
          placeholder="Público atendido"
          value={formData.publico_atendido}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
        />
        <textarea
          name="sobre"
          placeholder="Sobre você/sua organização"
          value={formData.sobre}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
        />
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              name="disponibilidade_retirada"
              checked={formData.disponibilidade_retirada}
              onChange={handleChange}
            />
            Posso retirar itens
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold' }}>Tipos de itens que aceita:</label>
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
