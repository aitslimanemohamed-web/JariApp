import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F9FC", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
          <span style={{ backgroundColor: "#FF6B35", color: "white", fontWeight: 800, fontSize: "1.2rem", padding: "3px 10px", borderRadius: "8px" }}>jari</span>
          <span style={{ color: "#1B4F72", fontWeight: 700, fontSize: "1.2rem" }}>app</span>
        </Link>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        {children}
      </div>
    </div>
  );
}
