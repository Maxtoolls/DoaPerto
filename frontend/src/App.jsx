import { useState, useEffect } from 'react';
import './App.css';

function Navbar({ currentPage, setCurrentPage, user, setUser, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
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
            <span style={{ fontSize: '0.9rem' }}>👤 {user.username}</span>
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

  useEffect(() => {
    carregarItens();
    carregarCategorias();
  }, [token]);

  const carregarItens = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/itens-doacao/meus_itens/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setItens(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categorias/');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.results || data);
      }
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/itens-doacao/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          categoria: formData.categoria_id
        })
      });

      if (response.ok) {
        setFormData({
          titulo: '',
          descricao: '',
          categoria_id: '',
          quantidade: 1,
          unidade: 'unidade'
        });
        setShowForm(false);
        carregarItens();
      }
    } catch (err) {
      console.error('Erro ao criar item:', err);
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
                style={{
                  background: '#FF9500',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                ✓ Publicar Item
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
                      {item.categoria}
                    </span>
                  </div>
                  <h3 style={{ color: '#333', marginBottom: '0.5rem', margin: '0.5rem 0' }}>{item.titulo}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                    {item.descricao}
                  </p>
                  <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    📅 {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
                  </p>

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

function Explorar() {
  const [doacoes, setDoacoes] = useState([
    { id: 1, item: 'Cesta Básica', categoria: 'Alimento', quantidade: 2, data_criacao: '2026-05-10' },
    { id: 2, item: 'Livros', categoria: 'Educação', quantidade: 5, data_criacao: '2026-05-10' },
    { id: 3, item: 'Roupas', categoria: 'Vestuário', quantidade: 10, data_criacao: '2026-05-09' },
  ]);
  const [loading, setLoading] = useState(false);

  // Carregar doações da API
  const carregarDoacoes = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/doacoes/')
      .then(res => res.json())
      .then(data => {
        console.log('Doações carregadas:', data);
        if (data.results) {
          setDoacoes(data.results);
        } else if (Array.isArray(data)) {
          setDoacoes(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar doações:', err);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#FF9500', margin: 0 }}>Explorar Doações</h1>
        <button
          onClick={carregarDoacoes}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#FF9500',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Carregando...' : 'Carregar da API'}
        </button>
      </div>

      {doacoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Nenhuma doação encontrada</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {doacoes.map(doacao => (
            <div
              key={doacao.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ background: '#FFF3E0', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ background: '#FF9500', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {doacao.categoria}
                </span>
                <span style={{ background: '#FFB84D', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {doacao.quantidade}x
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{doacao.item}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Disponível desde {new Date(doacao.data_criacao).toLocaleDateString('pt-BR')}
                </p>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#FF9500',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
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
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Usuário ou senha inválidos');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access);
      setToken(data.access);
      setUser({ username, email: username });
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
    first_name: ''
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
      const response = await fetch('http://localhost:8000/api/auth/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erro ao criar conta');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access);
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setUser={setUser} setToken={setToken} />
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'explorar' && <Explorar />}
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} setUser={setUser} setToken={setToken} />}
        {currentPage === 'registro' && <Registro setCurrentPage={setCurrentPage} setUser={setUser} setToken={setToken} />}
        {currentPage === 'dashboard' && <Dashboard user={user} setCurrentPage={setCurrentPage} token={token} />}
        {currentPage === 'meus-itens' && token && <MeusItens token={token} setCurrentPage={setCurrentPage} />}
      </main>
    </div>
  );
}
