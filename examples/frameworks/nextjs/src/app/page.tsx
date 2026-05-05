import Link from "next/link";

const examples = [
  {
    name: "Send a predefined email using the API route",
    description: "This example demonstrates how to send an email using a predefined API route that interacts with the MailChannels SDK.",
    path: "/send"
  }
];

export default function Home () {
  return (
    <main>
      <h1>Next.js + MailChannels Examples</h1>
      <ul>
        {examples.map(example => (
          <li key={example.path}>
            <Link href={example.path}>
              <strong>{example.name}</strong>
            </Link>
            <span>: {example.description}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
