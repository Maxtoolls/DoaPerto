import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#FF9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p>Não tem conta? <a href="/registro">Registre-se aqui</a></p>
    </div>
  );
}
