import { SignupForm } from "@/app/_components/signup-form";
import { AuthCard } from "@/app/_components/auth-card";
import { TextLink } from "@/app/_components/text-link";

export default function RegistroPage() {
  return (
    <AuthCard
      title="Criar conta"
      footer={
        <>
          Já tem conta? <TextLink href="/login">Entrar</TextLink>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
