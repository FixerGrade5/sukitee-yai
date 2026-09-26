import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        padding: '3rem 1.5rem',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>สุกี้ตี๋ใหญ่</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>ระบบสั่งอาหารร้านบุฟเฟต์</p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        <Link
          href="/generate-qr"
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            borderRadius: 8,
            textDecoration: 'none',
            color: '#111',
          }}
        >
          ไปหน้าสร้าง QR Code (/generate-qr)
        </Link>
        <Link
          href="/kitchen"
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            borderRadius: 8,
            textDecoration: 'none',
            color: '#111',
          }}
        >
          ไปหน้าครัว (/kitchen)
        </Link>
      </div>
    </main>
  );
}
