// app/layout.js
import './styles/globals.css'; // Import Tailwind CSS
import Header from "/app/components/Header";

export const metadata = {
  title: 'Your App Title',
  description: 'App description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {children}
      </body>
    </html>
  );
}
