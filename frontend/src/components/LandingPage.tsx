import { WalletButton } from './WalletButton';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage = ({ onEnter }: LandingPageProps) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear',
        pointerEvents: 'none'
      }} />
      
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-50px, -50px) rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

      <div style={{
        maxWidth: '1200px',
        width: '100%',
        zIndex: 1,
        textAlign: 'center'
      }}>
        {/* Logo/Title */}
        <div className="fade-in-up" style={{
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            🛍️ StackMart
          </h1>
          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '0.5rem',
            fontWeight: 300
          }}>
            Decentralized Marketplace on Stacks
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Buy and sell digital goods as NFTs with built-in licensing, escrow, and automatic royalty splits
          </p>
        </div>

        {/* Features Grid */}
        <div className="fade-in-up" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          marginTop: '3rem'
        }}>
          {[
            { icon: '🔐', title: 'Secure Escrow', desc: 'Smart contracts handle payments safely' },
            { icon: '💰', title: 'Auto Royalties', desc: 'Automatic splits to collaborators' },
            { icon: '⭐', title: 'Reputation System', desc: 'On-chain seller/buyer ratings' },
            { icon: '⚖️', title: 'Dispute Resolution', desc: 'Community-powered arbitration' },
            { icon: '📦', title: 'Bundles & Packs', desc: 'Curated collections with discounts' },
            { icon: '🌐', title: 'Multi-Wallet', desc: 'Support for all major wallets' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {feature.icon}
              </div>
              <h3 style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="fade-in-up" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
              onClick={onEnter}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#667eea',
                background: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
              }}
            >
              🚀 Enter Marketplace
            </button>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <WalletButton />
            </div>
          </div>

          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            marginTop: '1rem'
          }}>
            Connect your wallet to start buying and selling digital goods
          </p>
        </div>

        {/* Stats */}
        <div className="fade-in-up" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '4rem',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Blockchain', value: 'Stacks' },
            { label: 'Payments', value: 'STX' },
            { label: 'Smart Contracts', value: 'Clarity' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

