import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserProvider } from '../context/UserContext'; 


export const metadata = {
  title: 'Pelu PetShop',
  description: 'Tienda de mascotas y peluquería canina',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <UserProvider>
          <Header />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}