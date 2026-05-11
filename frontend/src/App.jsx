import { useState } from 'react';
import './App.css';

function Navbar({ currentPage, setCurrentPage }) {
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
      <div style={{ display: 'flex', gap: '2rem', color: 'white' }}>
        <button
          onClick={() => setCurrentPage('explorar')}
          style={{ color: 'white', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}
        >
          Explorar
        </button>
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

function Explorar() {
  const [doacoes] = useState([
    { id: 1, item: 'Cesta Básica', categoria: 'Alimento', quantidade: 2, data: '2026-05-10' },
    { id: 2, item: 'Livros', categoria: 'Educação', quantidade: 5, data: '2026-05-10' },
    { id: 3, item: 'Roupas', categoria: 'Vestuário', quantidade: 10, data: '2026-05-09' },
  ]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#FF9500', marginBottom: '1rem' }}>Explorar Doações</h1>
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
                Disponível desde {doacao.data}
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
    </div>
  );
}

function Login({ setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        <form onSubmit={(e) => { e.preventDefault(); alert('Login realizado!'); }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
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
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#FF9500',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Entrar
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Não tem conta? <button onClick={() => setCurrentPage('registro')} style={{ background: 'none', border: 'none', color: '#FF9500', fontWeight: 'bold', cursor: 'pointer' }}>Crie uma aqui</button>
        </p>
      </div>
    </div>
  );
}

function Registro({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Conta criada com sucesso!');
    setCurrentPage('home');
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
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="João Silva"
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
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
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
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#FF9500',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Criar Conta
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'explorar' && <Explorar />}
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'registro' && <Registro setCurrentPage={setCurrentPage} />}
      </main>
    </div>
  );
}
