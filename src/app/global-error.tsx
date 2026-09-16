"use client";

// Filet de secours ultime : ne se déclenche que si la mise en page racine
// elle-même échoue (rare). Doit redéfinir <html>/<body> et rester très
// simple — pas de dépendance à des composants qui pourraient eux aussi
// être en cause.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#f3efe8",
          color: "#17130d",
        }}
      >
        <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#ff5b1f" }}>
          Petit souci technique
        </p>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0.8rem 0" }}>
          Le site n&apos;a pas pu s&apos;afficher
        </h1>
        <p style={{ maxWidth: 380, lineHeight: 1.5, color: "#4c463b", fontSize: "0.9rem" }}>
          Écrivez-nous directement sur WhatsApp pour commander quand même : <strong>+229 63 23 41 14</strong>.
        </p>
        <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.7rem" }}>
          <button
            onClick={reset}
            style={{
              borderRadius: 999, padding: "0.7rem 1.4rem", fontSize: "0.85rem", fontWeight: 600,
              background: "#17130d", color: "#f3efe8", border: "none", cursor: "pointer",
            }}
          >
            Réessayer
          </button>
          <a
            href="https://wa.me/22963234114?text=Bonjour%20Techzone%20B%C3%A9nin%2C%20le%20site%20a%20eu%20un%20souci%20technique%2C%20pouvez-vous%20m%27aider%20%3F"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              borderRadius: 999, padding: "0.7rem 1.4rem", fontSize: "0.85rem", fontWeight: 600,
              background: "#1fb855", color: "#fff", textDecoration: "none",
            }}
          >
            WhatsApp
          </a>
        </div>
      </body>
    </html>
  );
}
