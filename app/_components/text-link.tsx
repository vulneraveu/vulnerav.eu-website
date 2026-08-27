import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkProps = ComponentProps<typeof Link>;

export function TextLink({ className = "", ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={`text-accent-700 underline transition-colors hover:text-accent-900 ${className}`}
    />
  );
}
