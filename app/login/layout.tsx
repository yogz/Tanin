import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Tanin",
  description: "Connectez-vous à votre cave",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
