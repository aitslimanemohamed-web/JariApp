import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "JariApp — Services entre voisins en Algérie",
  description: "Trouvez des prestataires de confiance près de chez vous. Plomberie, électricité, ménage, cours particuliers et bien plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
