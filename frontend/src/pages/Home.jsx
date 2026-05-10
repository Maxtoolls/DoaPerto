export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🤝 Bem-vindo ao DoaPerto</h1>
      <p style={{ fontSize: '1.1rem', color: '#666' }}>
        Sistema de doações P2P com geolocalização. Conectando quem quer doar com quem precisa receber.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>📍 Etapa 1: Consciencialização</h3>
          <p>Receba indicação de pessoas que já usam DoaPerto e descubra como funciona.</p>
        </div>

        <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>🔍 Etapa 2: Consideração</h3>
          <p>Procure itens próximos de você usando filtros por categoria e distância.</p>
        </div>

        <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>⚡ Etapa 3: Ação</h3>
          <p>Solicite o item que deseja através de um simples clique.</p>
        </div>

        <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>💬 Etapa 4: Interação</h3>
          <p>Combine a retirada do item através de um chat amigável.</p>
        </div>

        <div style={{ background: '#FFF3E0', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>❤️ Etapa 5: Retenção</h3>
          <p>Indique DoaPerto para seus familiares e amigos.</p>
        </div>
      </div>
    </div>
  );
}
