<<<<<<< HEAD
// app/layout.js or app/RootLayout.js (depending on your file structure)
import './globals.css';  // Import global Tailwind CSS styles
=======
// app/layout.js
import './styles/globals.css'; // Import Tailwind CSS
import Header from "/app/components/Header";

export const metadata = {
  title: 'Your App Title',
  description: 'App description',
};
>>>>>>> origin/home

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Parkify - Mobile Parking Web App" />
        <meta name="theme-color" content="#000000" />
        <title>Parkify Mobile App</title>
      </head>
      <body className="bg-gray-100 min-h-screen">
        {children}  {/* Render the content of individual pages here */}
=======
      <body>
        
        {children}
>>>>>>> origin/home
      </body>
    </html>
  );
}
