import React, { useState, useEffect } from 'react';
import apiClient from './api/client';
import './App.css';

function Navbar({ currentPage, setCurrentPage, user, setUser, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <nav style={{
      background: '#FF9500',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={() => setCurrentPage('home')}
        style={{
          fontSize: '1.8rem',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🤝 DoaPerto
      </button>
      <div style={{ display: 'flex', gap: '2rem', color: 'white', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentPage('explorar')}
          style={{ color: 'white', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}
        >
          Explorar
        </button>
        {user ? (
          <>
            <button
              onClick={() => setCurrentPage('perfil')}
              style={{ color: 'white', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              👤 {user.username}
            </button>
            <button
              onClick={handleLogout}
              style={{ color: 'white', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentPage('login')}
              style={{ color: 'white', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage('registro')}
              style={{
                background: 'white',
                color: '#FF9500',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Registrar
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function Card({ icon, title, description }) {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ color: '#FF9500', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </div>
  );
}

function JourneyStep({ number, icon, title }) {
  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      flex: 1,
      minWidth: '150px',
      border: '2px solid #FFE6CC'
    }}>
      <div style={{
        background: '#FF9500',
        color: 'white',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        fontWeight: 'bold'
      }}>
        {number}
      </div>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h4 style={{ color: '#FF9500', margin: 0 }}>{title}</h4>
    </div>
  );
}

function Home({ setCurrentPage }) {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝 DoaPerto</h2>
        <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>
          Conectando quem quer dar com quem precisa receber
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentPage('explorar')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              background: 'white',
              color: '#FF9500',
              border: 'none',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Explorar Agora
          </button>
          <button
            onClick={() => setCurrentPage('registro')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Criar Conta
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#333' }}>
          Como Funciona
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem'
        }}>
          <Card icon="🔍" title="Explore" description="Encontre itens e pontos próximos" />
          <Card icon="❤️" title="Doe" description="Compartilhe com quem precisa" />
          <Card icon="📍" title="Localize" description="Use geolocalização" />
          <Card icon="💬" title="Converse" description="Chat com doadores" />
        </div>
      </section>

      {/* Journey */}
      <section style={{
        background: 'white',
        padding: '4rem 2rem',
        margin: '2rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#333' }}>
            A Jornada do Doador
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem'
          }}>
            <JourneyStep number="1" icon="💡" title="Consciencialização" />
            <JourneyStep number="2" icon="🔍" title="Consideração" />
            <JourneyStep number="3" icon="⚡" title="Ação" />
            <JourneyStep number="4" icon="💬" title="Interação" />
            <JourneyStep number="5" icon="❤️" title="Retenção" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        background: '#FF9500',
        color: 'white',
        padding: '3rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>150+</div>
            <div>Itens Disponíveis</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>45+</div>
            <div>Pontos de Coleta</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>300+</div>
            <div>Usuários Ativos</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1000+</div>
            <div>Doações Realizadas</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#FF9500',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Pronto para começar?</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Junte-se à comunidade DoaPerto</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentPage('registro')}
            style={{
              padding: '0.9rem 2rem',
              fontSize: '1rem',
              background: 'white',
              color: '#FF9500',
              border: 'none',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Registrar como Doador
          </button>
          <button
            onClick={() => setCurrentPage('registro')}
            style={{
              padding: '0.9rem 2rem',
              fontSize: '1rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Registrar como Receptor
          </button>
        </div>
      </section>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Ocorreu um erro ao carregar a aplicação.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: 800, margin: '1rem auto' }}>
            {String(this.state.error)}
          </pre>
          <p>Abra o console do navegador para mais detalhes.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function Dashboard({ user, setCurrentPage, token }) {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👋 Bem-vindo, {user?.username}!</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>Que tipo de usuário você é?</p>
      </section>

      <section style={{
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎁</div>
            <h3 style={{ color: '#FF9500', marginBottom: '1rem', fontSize: '1.3rem' }}>Sou Doador</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Compartilhe seus itens e ajude quem precisa</p>
            <button onClick={() => setCurrentPage('meus-itens')} style={{
              background: '#FF9500',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Meus Itens
            </button>
          </div>

          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: '#FF9500', marginBottom: '1rem', fontSize: '1.3rem' }}>Sou Receptor</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Receba doações de pessoas generosas</p>
            <button onClick={() => setCurrentPage('meus-interesses')} style={{
              background: '#FF9500',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Meus Interesses
            </button>
          </div>
        </div>
      </section>

      <section style={{
        background: 'white',
        padding: '3rem 2rem',
        margin: '2rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem', color: '#333' }}>Próximos Passos</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #FF9500' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
              <h4 style={{ color: '#FF9500', marginBottom: '0.5rem' }}>Complete seu Perfil</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Adicione foto e informações pessoais</p>
            </div>
            <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #FF9500' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
              <h4 style={{ color: '#FF9500', marginBottom: '0.5rem' }}>Explore Itens</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Veja doações disponíveis perto de você</p>
            </div>
            <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #FF9500' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
              <h4 style={{ color: '#FF9500', marginBottom: '0.5rem' }}>Conecte-se</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Converse com outros usuários no chat</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MeusItens({ token, setCurrentPage }) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria_id: '',
    quantidade: 1,
    unidade: 'unidade'
  });
  const [categorias, setCategorias] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [destinoTipo, setDestinoTipo] = useState('direto');
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [openInteresses, setOpenInteresses] = useState({});

  useEffect(() => {
    if (token) {
      carregarItens();
    } else {
      setLoading(false);
    }
    carregarCategorias();
    carregarInstituicoes();
  }, [token]);

  const carregarItens = async () => {
    try {
      const response = await apiClient.get('/itens-doacao/meus_itens/');
      setItens(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const response = await apiClient.get('/categorias/');
      setCategorias(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const carregarInstituicoes = async () => {
    try {
      const response = await apiClient.get('/receptores/');
      setInstituicoes(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar instituições:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDestinoChange = (e) => {
    const value = e.target.value;
    setDestinoTipo(value);
    if (value !== 'instituicao') {
      setInstituicaoSelecionada('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');

    if (destinoTipo === 'instituicao' && !instituicaoSelecionada) {
      setFeedback('Selecione uma instituição cadastrada para continuar.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        titulo: String(formData.titulo),
        descricao: String(formData.descricao),
        quantidade: Number(formData.quantidade) || 1,
        unidade: String(formData.unidade) || 'unidade',
        pode_retirar_diretamente: destinoTipo !== 'instituicao',
      };

      if (formData.categoria_id) payload.categoria = Number(formData.categoria_id);
      if (destinoTipo === 'instituicao' && instituicaoSelecionada) payload.receptor_confirmado = Number(instituicaoSelecionada);
      // only include ponto_coleta if selected (not used currently)

      console.debug('Publicando item - payload:', payload);

      await apiClient.post('/itens-doacao/', payload);

      setFormData({
        titulo: '',
        descricao: '',
        categoria_id: '',
        quantidade: 1,
        unidade: 'unidade'
      });
      setDestinoTipo('direto');
      setInstituicaoSelecionada('');
      setFeedback('Item publicado com sucesso. Você pode cadastrar outro em seguida.');
      await carregarItens();
    } catch (err) {
      // log full response body for debugging
      console.debug('Erro ao criar item - response status:', err.response?.status, 'data:', err.response?.data);
      const detail = err.response?.data?.detail;
      const fieldErrors = err.response?.data;
      const message = detail || (fieldErrors ? JSON.stringify(fieldErrors) : 'Erro ao criar item.');
      setFeedback(message);
      console.error('Erro ao criar item:', err);
    } finally {
      setSaving(false);
    }
  };

  const deletarItem = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/itens-doacao/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        carregarItens();
      }
    } catch (err) {
      console.error('Erro ao deletar item:', err);
    }
  };

  const statusColors = {
    'disponivel': '#4CAF50',
    'interessado': '#FF9500',
    'doado': '#2196F3',
    'cancelado': '#f44336'
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
        color: 'white',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', margin: 0 }}>🎁 Meus Itens para Doação</h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>Gerencie seus itens e veja o interesse de receptores</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              ← Voltar
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: 'white',
                color: '#FF9500',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              {showForm ? '❌ Cancelar' : '➕ Novo Item'}
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {showForm && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Adicionar Novo Item</h3>
            {feedback && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.9rem 1rem',
                borderRadius: '8px',
                background: feedback.includes('sucesso') ? '#E8F5E9' : '#FFF3E0',
                color: feedback.includes('sucesso') ? '#2E7D32' : '#A15C00',
                border: `1px solid ${feedback.includes('sucesso') ? '#A5D6A7' : '#FFD59E'}`
              }}>
                {feedback}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Cesta Básica"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Categoria</label>
                  <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Destino da doação</label>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="destinoTipo"
                      value="direto"
                      checked={destinoTipo === 'direto'}
                      onChange={handleDestinoChange}
                    />
                    Disponibilizar para doação direta
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="destinoTipo"
                      value="instituicao"
                      checked={destinoTipo === 'instituicao'}
                      onChange={handleDestinoChange}
                    />
                    Entregar para instituição cadastrada
                  </label>
                </div>
              </div>

              {destinoTipo === 'instituicao' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Instituição cadastrada</label>
                  <select
                    value={instituicaoSelecionada}
                    onChange={(e) => setInstituicaoSelecionada(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Selecione uma instituição</option>
                    {instituicoes.map((instituicao) => {
                      const nome = instituicao?.usuario?.user?.first_name || instituicao?.usuario?.user?.username || 'Instituição';
                      const tipo = instituicao?.tipo ? ` - ${instituicao.tipo}` : '';
                      return (
                        <option key={instituicao.id} value={instituicao.id}>
                          {nome}{tipo}
                        </option>
                      );
                    })}
                  </select>
                  {instituicoes.length === 0 && (
                    <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.9rem' }}>
                      Nenhuma instituição cadastrada encontrada no momento.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o item detalhadamente..."
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Quantidade</label>
                  <input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleChange}
                    min="1"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Unidade</label>
                  <select
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="unidade">Unidade</option>
                    <option value="kg">Quilograma (kg)</option>
                    <option value="litro">Litro (L)</option>
                    <option value="metro">Metro (m)</option>
                    <option value="caixa">Caixa</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#FF9500',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                {saving ? 'Publicando...' : '✓ Publicar Item'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', color: '#666' }}>
            Carregando seus itens...
          </div>
        ) : itens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Nenhum item cadastrado</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Clique em "Novo Item" para começar a compartilhar</p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: '#FF9500',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ➕ Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {itens.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  background: statusColors[item.status] || '#FF9500',
                  color: 'white',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    {item.status}
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.3)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {item.quantidade}x {item.unidade}
                  </span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ background: '#FFF3E0', color: '#FF9500', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {item.categoria_nome || item.categoria}
                    </span>
                  </div>
                  <h3 style={{ color: '#333', marginBottom: '0.5rem', margin: '0.5rem 0' }}>{item.titulo}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                    {item.descricao}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {item.receptor_confirmado_nome
                      ? `Destino: ${item.receptor_confirmado_nome}`
                      : item.ponto_coleta_nome
                        ? `Destino: ${item.ponto_coleta_nome}`
                        : 'Destino: doação direta'}
                  </p>
                  <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    📅 {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
                  </p>

                  {item.interesses && item.interesses.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <button
                        onClick={() => setOpenInteresses((s) => ({ ...s, [item.id]: !s[item.id] }))}
                        style={{
                          background: 'transparent',
                          color: '#FF9500',
                          border: '1px solid #FF9500',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {openInteresses[item.id] ? 'Ocultar interessados' : `Mostrar ${item.interesses.length} interessado(s)`}
                      </button>

                      {openInteresses[item.id] && (
                        <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.5rem' }}>
                          {item.interesses.map((it) => (
                            <div key={it.id} style={{ background: '#FAFAFA', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eee' }}>
                              <div style={{ fontWeight: '700', color: '#333' }}>{it.receptor_nome || it.receptor}</div>
                              {it.mensagem_inicial && <div style={{ color: '#666', fontSize: '0.9rem' }}>{it.mensagem_inicial}</div>}
                              <div style={{ marginTop: '0.25rem' }}><span style={{ background: '#FFF3E0', color: '#A15C00', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>{it.status}</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setCurrentPage('item-' + item.id)}
                      style={{
                        flex: 1,
                        background: '#FF9500',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      👀 Ver Interesses
                    </button>
                    <button
                      onClick={() => deletarItem(item.id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1rem',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemInteresses({ itemId, setCurrentPage }) {
  const [item, setItem] = useState(null);
  const [interesses, setInteresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDetalhes = async () => {
      setLoading(true);
      try {
        const [itemResponse, interessesResponse] = await Promise.all([
          apiClient.get(`/itens-doacao/${itemId}/`),
          apiClient.get(`/interesses/?item=${itemId}`),
        ]);

        setItem(itemResponse.data);
        setInteresses(interessesResponse.data.results || interessesResponse.data);
      } catch (err) {
        console.error('Erro ao carregar interesses do item:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [itemId]);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
        color: 'white',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', margin: 0 }}>👀 Interesses do Item</h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>Acompanhe quem demonstrou interesse nesta doação</p>
          </div>
          <button
            onClick={() => setCurrentPage('meus-itens')}
            style={{
              background: 'white',
              color: '#FF9500',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            ← Voltar para meus itens
          </button>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', color: '#666' }}>
            Carregando detalhes do item...
          </div>
        ) : !item ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#666' }}>Item não encontrado.</p>
            <button
              onClick={() => setCurrentPage('meus-itens')}
              style={{
                marginTop: '1rem',
                background: '#FF9500',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        ) : (
          <>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '0.75rem' }}>{item.titulo}</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>{item.descricao}</p>
              <p style={{ color: '#999', marginBottom: '0' }}>
                Categoria: {item.categoria_nome || item.categoria} | Quantidade: {item.quantidade} {item.unidade}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {interesses.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#666' }}>
                  Nenhum interesse registrado ainda.
                </div>
              ) : (
                interesses.map((interesse) => (
                  <div key={interesse.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>{interesse.receptor_nome || 'Receptor'}</h4>
                    <p style={{ color: '#666', marginBottom: '0.75rem' }}>{interesse.mensagem_inicial || 'Sem mensagem inicial.'}</p>
                    <span style={{ background: '#FFF3E0', color: '#FF9500', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {interesse.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MeusInteresses({ setCurrentPage }) {
  const [interesses, setInteresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarInteresses = async () => {
      try {
        const response = await apiClient.get('/interesses/');
        setInteresses(response.data.results || response.data);
      } catch (err) {
        console.error('Erro ao carregar meus interesses:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarInteresses();
  }, []);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
        color: 'white',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', margin: 0 }}>💬 Meus Interesses</h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>Veja os itens nos quais você demonstrou interesse</p>
          </div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              background: 'white',
              color: '#FF9500',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            ← Voltar ao dashboard
          </button>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', color: '#666' }}>
            Carregando interesses...
          </div>
        ) : interesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'white', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💭</div>
            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Nenhum interesse registrado</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Explore itens disponíveis e clique em Expressar Interesse.</p>
            <button
              onClick={() => setCurrentPage('explorar')}
              style={{
                background: '#FF9500',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Explorar itens
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {interesses.map((interesse) => (
              <div key={interesse.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>{interesse.item_titulo || 'Item'}</h4>
                <p style={{ color: '#666', marginBottom: '0.75rem' }}>{interesse.mensagem_inicial || 'Sem mensagem inicial.'}</p>
                <span style={{ background: '#FFF3E0', color: '#FF9500', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {interesse.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpressarInteresse({ setCurrentPage, token }) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [enviandoId, setEnviandoId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [interessesEnviados, setInteressesEnviados] = useState([]);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarItens();
  }, [categoria]);

  const carregarCategorias = async () => {
    try {
      const response = await apiClient.get('/categorias/');
      setCategorias(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar categorias para expressar interesse:', err);
    }
  };

  const carregarItens = async () => {
    setLoading(true);
    try {
      const url = categoria ? `/itens-doacao/?categoria=${categoria}` : '/itens-doacao/';
      const response = await apiClient.get(url);
      setItens(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar itens para expressar interesse:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressarInteresse = async (item) => {
    if (!token) {
      setCurrentPage('login');
      return;
    }

    setEnviandoId(item.id);
    setFeedback('');

    try {
      await apiClient.post(`/itens-doacao/${item.id}/expressar_interesse/`, {
        mensagem: 'Tenho interesse neste item.',
      });
      setInteressesEnviados((atual) => [...atual, item.id]);
      setFeedback(`Interesse enviado para "${item.titulo}".`);
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Não foi possível expressar interesse neste item.';
      setFeedback(mensagem);
    } finally {
      setEnviandoId(null);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <section style={{
        background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
        color: 'white',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', margin: 0 }}>💬 Expressar Interesse</h2>
            <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: '0.5rem 0 0 0' }}>Veja os itens disponíveis e manifeste interesse em poucos cliques</p>
          </div>
          <button
            onClick={() => setCurrentPage('explorar')}
            style={{
              background: 'white',
              color: '#FF9500',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            ← Voltar para explorar
          </button>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {!token && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Faça login para expressar interesse</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Você pode ver a página, mas o envio do interesse exige autenticação.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('login')}
                style={{
                  background: '#FF9500',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Ir para login
              </button>
              <button
                onClick={() => setCurrentPage('explorar')}
                style={{
                  background: 'transparent',
                  color: '#FF9500',
                  border: '1px solid #FF9500',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Voltar para explorar
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.9rem 1rem',
            borderRadius: '8px',
            background: feedback.toLowerCase().includes('não foi possível') || feedback.toLowerCase().includes('apenas') || feedback.toLowerCase().includes('já expressou') ? '#FFF3E0' : '#E8F5E9',
            color: feedback.toLowerCase().includes('não foi possível') || feedback.toLowerCase().includes('apenas') || feedback.toLowerCase().includes('já expressou') ? '#A15C00' : '#2E7D32',
            border: `1px solid ${feedback.toLowerCase().includes('não foi possível') || feedback.toLowerCase().includes('apenas') || feedback.toLowerCase().includes('já expressou') ? '#FFD59E' : '#A5D6A7'}`
          }}>
            {feedback}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem', maxWidth: '320px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Filtrar por categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {token && loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'white', borderRadius: '12px' }}>Carregando itens...</div>
        ) : token && itens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'white', borderRadius: '12px' }}>
            <p style={{ margin: 0 }}>Nenhum item encontrado</p>
          </div>
        ) : token ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {itens.map((item) => {
              const interestAlreadySent = interessesEnviados.includes(item.id);

              return (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ background: '#FFF3E0', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <span style={{ background: '#FF9500', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {item.categoria_nome || item.categoria}
                    </span>
                    <span style={{ background: '#FFB84D', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {item.quantidade}x {item.unidade}
                    </span>
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ color: '#333', marginBottom: '0.5rem', marginTop: 0 }}>{item.titulo}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5', flex: 1 }}>
                      {item.descricao}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      📅 {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
                    </p>
                    <button
                      onClick={() => handleExpressarInteresse(item)}
                      disabled={enviandoId === item.id || interestAlreadySent}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: interestAlreadySent ? '#9CCC65' : '#FF9500',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: enviandoId === item.id || interestAlreadySent ? 'not-allowed' : 'pointer',
                        opacity: enviandoId === item.id ? 0.8 : 1
                      }}
                    >
                      {enviandoId === item.id ? 'Enviando...' : interestAlreadySent ? 'Interesse enviado' : 'Expressar Interesse'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Explorar({ setCurrentPage, token }) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarItens();
  }, [categoria]);

  const carregarCategorias = async () => {
    try {
      const response = await apiClient.get('/categorias/');
      setCategorias(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const carregarItens = async () => {
    setLoading(true);
    try {
      const url = categoria ? `/itens-doacao/?categoria=${categoria}` : '/itens-doacao/';
      const response = await apiClient.get(url);
      setItens(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#FF9500', margin: 0 }}>Explorar Doações</h1>
      </div>

      <div style={{ marginBottom: '1.5rem', maxWidth: '320px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Filtrar por categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Carregando itens...</div>
      ) : itens.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Nenhum item encontrado</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {itens.map(item => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ background: '#FFF3E0', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ background: '#FF9500', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {item.categoria_nome || item.categoria}
                </span>
                <span style={{ background: '#FFB84D', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {item.quantidade}x
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{item.titulo}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {item.receptor_confirmado_nome
                    ? `Destino: ${item.receptor_confirmado_nome}`
                    : item.ponto_coleta_nome
                      ? `Destino: ${item.ponto_coleta_nome}`
                      : 'Destino: doação direta'}
                </p>
                <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Disponível desde {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
                </p>
                <button
                  onClick={() => setCurrentPage('expressar-interesse')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#FF9500',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Expressar Interesse
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Login({ setCurrentPage, setUser, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await apiClient.post('/token/', { username, password });
      const data = response.data;
      localStorage.setItem('token', data.access);
      localStorage.setItem('access_token', data.access);
      setToken(data.access);
      setUser({ username, email: username });
      setCurrentPage('dashboard');
    } catch (err) {
      console.debug('Login error', err);
      if (err.response) {
        setErro(err.response.data?.detail || err.response.data?.error || 'Usuário ou senha inválidos');
      } else if (err.request) {
        setErro('Falha de rede ao conectar ao servidor (verifique se o backend está rodando e CORS está configurado).');
      } else {
        setErro('Erro ao tentar logar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        padding: '2.5rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>🤝 Bem-vindo de volta!</h2>
        {erro && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#FF9500',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Não tem conta? <button onClick={() => setCurrentPage('registro')} style={{ background: 'none', border: 'none', color: '#FF9500', fontWeight: 'bold', cursor: 'pointer' }}>Crie uma aqui</button>
        </p>
      </div>
    </div>
  );
}

function Registro({ setCurrentPage, setUser, setToken }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    tipo: 'doador'
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    if (!formData.username || !formData.email || !formData.password) {
      setErro('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/registro/', formData);
      const data = response.data;
      localStorage.setItem('token', data.access);
      localStorage.setItem('access_token', data.access);
      setToken(data.access);
      setUser({ username: formData.username, email: formData.email });
      setCurrentPage('dashboard');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        padding: '2.5rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>🤝 Crie sua conta</h2>
        {erro && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Tipo de conta</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'doador' })}
                style={{
                  flex: '1 1 140px',
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  border: formData.tipo === 'doador' ? '2px solid #FF9500' : '1px solid #ddd',
                  background: formData.tipo === 'doador' ? '#FFF3E0' : 'white',
                  color: '#333',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Sou doador
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'receptor' })}
                style={{
                  flex: '1 1 140px',
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  border: formData.tipo === 'receptor' ? '2px solid #FF9500' : '1px solid #ddd',
                  background: formData.tipo === 'receptor' ? '#FFF3E0' : 'white',
                  color: '#333',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Sou receptor
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Nome</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="João Silva"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Usuário</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="seu_usuario"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="joao@exemplo.com"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#FF9500',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Já tem conta? <button onClick={() => setCurrentPage('login')} style={{ background: 'none', border: 'none', color: '#FF9500', fontWeight: 'bold', cursor: 'pointer' }}>Faça login aqui</button>
        </p>
      </div>
    </div>
  );
}

function Profile({ setCurrentPage, setUser, setToken, token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const resp = await apiClient.get('/usuarios/me/');
        setData(resp.data);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      const payload = {
        first_name: data.user?.first_name || data.user?.username || '',
        email: data.user?.email || '',
        telefone: data.telefone || '',
        endereco: data.endereco || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null
      };
      const resp = await apiClient.patch('/usuarios/me/', payload);
      setData(resp.data);
      setUser((u) => ({ ...u, username: resp.data.user?.username || u?.username }));
      setFeedback('Perfil atualizado com sucesso.');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setFeedback('Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return;
    try {
      await apiClient.delete('/usuarios/me/');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
      setCurrentPage('home');
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      setFeedback('Erro ao deletar conta.');
    }
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando perfil...</div>
  );

  if (!data) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>Perfil não encontrado.</div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ marginTop: 0 }}>Meu Perfil</h2>
        {feedback && <div style={{ marginBottom: '1rem', color: '#2E7D32' }}>{feedback}</div>}
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
            <input name="first_name" value={data.user?.first_name || ''} onChange={(e) => setData({ ...data, user: { ...data.user, first_name: e.target.value } })} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input name="email" value={data.user?.email || ''} onChange={(e) => setData({ ...data, user: { ...data.user, email: e.target.value } })} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Telefone</label>
            <input name="telefone" value={data.telefone || ''} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Endereço</label>
            <input name="endereco" value={data.endereco || ''} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Latitude</label>
              <input name="latitude" value={data.latitude || ''} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Longitude</label>
              <input name="longitude" value={data.longitude || ''} onChange={handleChange} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={saving} style={{ background: '#FF9500', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '6px' }}>{saving ? 'Salvando...' : 'Salvar'}</button>
            <button type="button" onClick={handleDelete} style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '6px' }}>Excluir Conta</button>
            <button type="button" onClick={() => setCurrentPage('dashboard')} style={{ background: 'transparent', border: '1px solid #ddd', padding: '0.75rem 1rem', borderRadius: '6px' }}>Voltar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || localStorage.getItem('access_token'));
  // load user profile when token exists but user state is empty
  useEffect(() => {
    const fetchMe = async () => {
      if (!token || user) return;
      try {
        const resp = await apiClient.get('/usuarios/me/');
        const me = resp.data;
        setUser({ username: me.user?.username || me.user?.email, email: me.user?.email, first_name: me.user?.first_name });
      } catch (err) {
        console.error('Erro ao buscar perfil atual:', err);
        // se token inválido, limpar
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('access_token');
          setToken(null);
        }
      }
    };

    fetchMe();
  }, [token, user]);
  const isItemPage = currentPage.startsWith('item-');
  const isKnownPage = ['home', 'explorar', 'login', 'registro', 'dashboard', 'meus-itens', 'meus-interesses', 'expressar-interesse', 'perfil'].includes(currentPage) || isItemPage;
  const requiresToken = currentPage === 'dashboard' || currentPage === 'meus-itens' || currentPage === 'perfil' || isItemPage;
  const showHome = !isKnownPage || currentPage === 'home' || (requiresToken && !token);

  useEffect(() => {
    if (!isKnownPage || (requiresToken && !token)) {
      setCurrentPage('home');
    }
  }, [isKnownPage, requiresToken, token, setCurrentPage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setUser={setUser} setToken={setToken} />
      <ErrorBoundary>
        <main style={{ flex: 1 }}>
          {showHome && <Home setCurrentPage={setCurrentPage} />}
          {currentPage === 'explorar' && <Explorar setCurrentPage={setCurrentPage} token={token} />}
          {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} setUser={setUser} setToken={setToken} />}
          {currentPage === 'registro' && <Registro setCurrentPage={setCurrentPage} setUser={setUser} setToken={setToken} />}
          {currentPage === 'perfil' && token && <Profile setCurrentPage={setCurrentPage} setUser={setUser} setToken={setToken} token={token} />}
          {currentPage === 'dashboard' && token && <Dashboard user={user} setCurrentPage={setCurrentPage} token={token} />}
          {currentPage === 'meus-itens' && token && <MeusItens token={token} setCurrentPage={setCurrentPage} />}
          {currentPage === 'meus-interesses' && token && <MeusInteresses setCurrentPage={setCurrentPage} />}
          {currentPage === 'expressar-interesse' && <ExpressarInteresse setCurrentPage={setCurrentPage} token={token} />}
          {isItemPage && token && <ItemInteresses itemId={currentPage.replace('item-', '')} setCurrentPage={setCurrentPage} />}
        </main>
      </ErrorBoundary>
    </div>
  );
}
