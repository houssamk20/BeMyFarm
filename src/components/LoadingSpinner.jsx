export default function LoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{message}</p>
    </div>
  );
}
