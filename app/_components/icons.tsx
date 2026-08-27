type IconProps = { className?: string; filled?: boolean };

export function HeartIcon({ className, filled }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className={`${filled ? "icon-fill-active" : ""} ${className ?? ""}`}
    >
      <path d="M12 20.3S3.8 15.4 2 10.9C.7 7.6 2.3 4.2 5.7 3.6c2-.3 4 .6 5.1 2.2h2.4c1.1-1.6 3.1-2.5 5.1-2.2 3.4.6 5 4 3.7 7.3-1.8 4.5-10 9.4-10 9.4Z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
    >
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function CommentIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9.2L4.5 20.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

// Silhueta única (como o emoji ✋), não peças soltas — palma + 5 dedos de
// alturas diferentes num contorno só, no nosso traço fino em vez de emoji.
export function FeelIcon({ className, filled }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${filled ? "icon-fill-active" : ""} ${className ?? ""}`}
    >
      <path
        d="M8.3 21
           C6.6 21 5.4 19.9 4.6 18.6
           L2.1 14.4
           C1.6 13.6 1.9 12.6 2.7 12.1
           C3.4 11.7 4.3 11.9 4.8 12.5
           L6.5 14.5
           L6.5 6.6
           C6.5 5.7 7.2 5 8.1 5
           C9 5 9.7 5.7 9.7 6.6
           L9.7 11.5
           L9.7 4.1
           C9.7 3.2 10.4 2.5 11.3 2.5
           C12.2 2.5 12.9 3.2 12.9 4.1
           L12.9 11.5
           L12.9 4.6
           C12.9 3.7 13.6 3 14.5 3
           C15.4 3 16.1 3.7 16.1 4.6
           L16.1 11.5
           L16.1 6.9
           C16.1 6 16.8 5.3 17.7 5.3
           C18.6 5.3 19.3 6 19.3 6.9
           L19.3 15.5
           C19.3 18.5 17 21 14 21
           Z"
      />
    </svg>
  );
}
