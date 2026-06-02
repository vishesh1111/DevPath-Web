export default function MaintenanceOverlay({ message }: { message: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0f1115', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', zIndex: 9999, color: 'white'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Under Maintenance</h1>
      <p>{message || "We're updating our systems to serve you better."}</p>
    </div>
  );
}