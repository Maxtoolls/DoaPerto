import { Link } from 'react-router-dom';

export default function Home({ isAuthenticated }) {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>🤝 DoaPerto</h1>
          <p style={styles.heroSubtitle}>Conectando quem quer dar com quem precisa receber</p>
          <p style={styles.heroDescription}>
            Encontre pontos de doação próximos de você através de geolocalização ou doe direto de pessoa para pessoa
          </p>
          <div style={styles.heroButtons}>
            <Link to="/explorar" style={styles.primaryBtn}>
              Explorar Agora
            </Link>
            {!isAuthenticated && (
              <Link to="/registro" style={styles.secondaryBtn}>
                Criar Conta
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Como Funciona</h2>
        <div style={styles.grid}>
          <Card icon="🔍" title="Explore" description="Encontre itens e pontos de coleta próximos a você" />
          <Card icon="❤️" title="Doe" description="Compartilhe itens que não usa mais com quem precisa" />
          <Card icon="📍" title="Localize" description="Use geolocalização para encontrar o ponto mais próximo" />
          <Card icon="💬" title="Converse" description="Chat direto com doadores e receptores" />
        </div>
      </section>

      {/* Journey Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>A Jornada do Doador</h2>
        <div style={styles.journeyGrid}>
          <JourneyStep number="1" title="Consciencialização" icon="💡" description="Descubra DoaPerto através de indicações" />
          <JourneyStep number="2" title="Consideração" icon="🔍" description="Procure itens próximos com filtros" />
          <JourneyStep number="3" title="Ação" icon="⚡" description="Solicite o item desejado com um clique" />
          <JourneyStep number="4" title="Interação" icon="💬" description="Converse para combinar a retirada" />
          <JourneyStep number="5" title="Retenção" icon="❤️" description="Indique a amigos e familiares" />
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Pronto para começar?</h2>
          <p style={styles.ctaDescription}>Junte-se à comunidade DoaPerto e comece a fazer diferença</p>
          <div style={styles.ctaButtons}>
            <Link to="/registro" style={styles.primaryBtn}>
              Registrar como Doador
            </Link>
            <Link to="/registro" style={styles.secondaryBtn}>
              Registrar como Receptor
            </Link>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <Stat number="150+" label="Itens Disponíveis" />
        <Stat number="45+" label="Pontos de Coleta" />
        <Stat number="300+" label="Usuários Ativos" />
        <Stat number="1000+" label="Doações Realizadas" />
      </section>
    </div>
  );
}

function Card({ icon, title, description }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardIcon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDescription}>{description}</p>
    </div>
  );
}

function JourneyStep({ number, title, icon, description }) {
  return (
    <div style={styles.journeyCard}>
      <div style={styles.journeyNumber}>Etapa {number}</div>
      <div style={styles.journeyIcon}>{icon}</div>
      <h3 style={styles.journeyTitle}>{title}</h3>
      <p style={styles.journeyDescription}>{description}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statNumber}>{number}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  hero: {
    background: 'linear-gradient(135deg, #FF9500 0%, #FFB84D 100%)',
    color: 'white',
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '4rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    fontWeight: '500',
  },
  heroDescription: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    opacity: 0.95,
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: 'white',
    color: '#FF9500',
    padding: '1rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'inline-block',
  },
  secondaryBtn: {
    background: 'transparent',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid white',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'inline-block',
  },
  section: {
    maxWidth: '1200px',
    margin: '4rem auto',
    padding: '0 2rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#333',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#FF9500',
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#666',
    lineHeight: '1.6',
  },
  journeyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  journeyCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    border: '2px solid #FFE6CC',
  },
  journeyNumber: {
    background: '#FF9500',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    margin: '0 auto 1rem',
    fontSize: '0.9rem',
  },
  journeyIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  journeyTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: '#FF9500',
    fontWeight: 'bold',
  },
  journeyDescription: {
    color: '#666',
    fontSize: '0.9rem',
  },
  ctaSection: {
    background: '#FF9500',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
    margin: '4rem 0',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.95,
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statsSection: {
    maxWidth: '1200px',
    margin: '4rem auto',
    padding: '0 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  statCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#666',
    fontSize: '1.1rem',
  },
};

