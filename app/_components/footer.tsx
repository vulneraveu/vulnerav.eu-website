export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="w-full px-8 py-5 text-center">
        <p className="font-sans text-xs text-ink-muted">
          vulnerabilidades ·{" "}
          <a
            href="https://www.instagram.com/vulnerav.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted transition-colors hover:text-accent-700"
          >
            @vulnerav.eu
          </a>
        </p>
      </div>
    </footer>
  );
}
