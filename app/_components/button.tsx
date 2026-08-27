import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { btnPrimaryClass, btnDangerClass } from "@/app/_components/ui";

type Variant = "primary" | "danger";

const variantClass: Record<Variant, string> = {
  primary: btnPrimaryClass,
  danger: btnDangerClass,
};

type CommonProps = { variant?: Variant; className?: string; children?: ReactNode };
type LinkProps = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">;
type ButtonElProps = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className">;

// Um só componente pros dois casos: com href vira <Link> (navegação), sem
// href vira <button> (ação de form) — ambos com a mesma cara visual.
export function Button(props: LinkProps | ButtonElProps) {
  const { variant = "primary", className = "", ...rest } = props;
  const classes = `text-center ${variantClass[variant]} ${className}`;

  if (rest.href !== undefined) {
    return <Link {...(rest as Omit<LinkProps, "variant" | "className">)} className={classes} />;
  }
  return <button {...(rest as Omit<ButtonElProps, "variant" | "className">)} className={classes} />;
}
