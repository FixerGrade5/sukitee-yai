export const metadata = {
  title: 'สุกี้ตี๋ใหญ่',
  description: 'ระบบสั่งอาหารร้านบุฟเฟต์ สุกี้ตี๋ใหญ่',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
