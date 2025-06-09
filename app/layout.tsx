export const metadata = {
  title: 'Futuristic AI Chatbot',
  description: 'Your smart assistant built with GPT & love.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {children}
      </body>
    </html>
  );
}
