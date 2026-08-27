import { Button } from "@/app/_components/button";
import { PaperScraps } from "@/app/_components/paper-scraps";

export default function ConfissoesPage() {
  return (
    <main className="relative flex min-h-[70vh] w-full flex-1 flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      <PaperScraps className="confession-paper-scrap" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.15em] text-accent-500">anônimo, sempre</p>
        <h1 className="mb-4 max-w-2xl font-heading text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Um mural para o que você não tem coragem de dizer
        </h1>
        <p className="mb-8 max-w-lg font-body text-lg leading-relaxed text-ink-muted">
          Escreva o que pesa. O que você escrever aqui é só seu, até o momento em que se torna de todos.
        </p>
        <Button href="/mural">Entrar no mural</Button>
        <p className="mt-8 max-w-md font-sans text-xs text-ink-muted">
          Nenhum post é assinado. Ninguém saberá quem é você, nem nós. Sua confissão fica no mural para que outras
          pessoas possam ler, e talvez se reconhecer nela.
        </p>
      </div>
    </main>
  );
}
