import { LoginForm } from "@/app/_components/login-form";
import { AuthCard } from "@/app/_components/auth-card";
import { TextLink } from "@/app/_components/text-link";

export default function LoginPage() {
  return (
    <AuthCard
      title="Entrar"
      footer={
        <>
          Não tem conta? <TextLink href="/registro">Cadastre-se</TextLink>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
