interface MonnaLogoProps {
  className?: string;
  strokeColor?: string;
}

export function MonnaLogo({ className = "h-8 w-auto", strokeColor }: MonnaLogoProps) {
  return (
    <svg className={className} viewBox="0 0 70 55" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 48 L25 10 L42 48"
        fill="none"
        stroke={strokeColor || "currentColor"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 48 L45 10 L62 48"
        fill="none"
        stroke={strokeColor || "currentColor"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
