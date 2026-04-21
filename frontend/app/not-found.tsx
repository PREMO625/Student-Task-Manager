import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '32px',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(5rem, 12vw, 8rem)',
        fontWeight: 800,
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        404
      </h1>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.2rem',
        fontWeight: 600,
        marginBottom: '8px',
      }}>
        Page Not Found
      </p>
      <p style={{
        color: 'var(--text-secondary)',
        marginBottom: '28px',
        fontSize: '0.95rem',
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary" style={{ padding: '12px 32px' }}>
        Go Home
      </Link>
    </div>
  );
}
