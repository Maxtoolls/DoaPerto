import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function Explorar() {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchDoacoes();
    fetchCategorias();
  }, [categoria]);

  const fetchDoacoes = async () => {
    try {
      let url = '/doacoes/';
      if (categoria) {
        url += `?categoria=${categoria}`;
      }
      const response = await apiClient.get(url);
      setDoacoes(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar doações', err);
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await apiClient.get('/categorias/');
      setCategorias(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao buscar categorias', err);
    }
  };

  return (
    <div style={styles.container}>
      <section style={styles.header}>
        <h1 style={styles.title}>Explorar Doações</h1>
        <p style={styles.subtitle}>Encontre itens disponíveis para doação</p>
      </section>

      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <h3 style={styles.filterTitle}>Filtros</h3>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={styles.select}
            >
              <option value="">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </aside>

        <main style={styles.main}>
          {loading ? (
            <div style={styles.loading}>Carregando doações...</div>
          ) : doacoes.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>Nenhuma doação encontrada</p>
              <p style={styles.emptySubtext}>Tente alterar os filtros ou volte mais tarde</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {doacoes.map(doacao => (
                <div key={doacao.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.categoryTag}>{doacao.categoria}</span>
                    <span style={styles.quantityTag}>{doacao.quantidade}x</span>
                  </div>
                  <h3 style={styles.cardTitle}>{doacao.item}</h3>
                  <p style={styles.cardDescription}>{doacao.descricao}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.date}>{new Date(doacao.data_criacao).toLocaleDateString('pt-BR')}</span>
                    <button style={styles.actionBtn}>Expressar Interesse</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
    color: 'white',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.95,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '2rem',
  },
  sidebar: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  filterTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
  },
  filterGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#666',
    fontWeight: '500',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    background: 'white',
    borderRadius: '12px',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem 2rem',
    background: 'white',
    borderRadius: '12px',
  },
  emptyText: {
    fontSize: '1.3rem',
    color: '#999',
    marginBottom: '0.5rem',
  },
  emptySubtext: {
    color: '#bbb',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#FFF3E0',
  },
  categoryTag: {
    background: '#FF9500',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  quantityTag: {
    background: '#FFB84D',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    padding: '1rem 1rem 0.5rem',
  },
  cardDescription: {
    color: '#666',
    fontSize: '0.9rem',
    padding: '0 1rem 1rem',
    lineHeight: '1.5',
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderTop: '1px solid #eee',
  },
  date: {
    color: '#999',
    fontSize: '0.85rem',
  },
  actionBtn: {
    background: '#FF9500',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
};
