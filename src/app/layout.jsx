import "./globals.css";

export const metadata = {
  title: "Anuntech AI - Chat Inteligente",
  description: "Chat inteligente com IA para responder suas perguntas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/lib/common.min.js"></script>
      </head>
      <body className="h-full overflow-hidden">
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
} 