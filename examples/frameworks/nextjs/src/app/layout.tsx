import Link from "next/link";

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Link href="/">Home</Link>
        {children}
      </body>
    </html>
  );
}
