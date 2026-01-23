import { SVGProps } from "react";

export function Stethoscope(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 12h3a3 3 0 0 1 3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 1 3-3h3M7 5a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function Heartbeat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20.4 5.4a6 6 0 0 0-8.5 0L12 6l-.9-.6a6 6 0 0 0-8.5 8.5L12 22l9.4-8.1a6 6 0 0 0 0-8.5z" />
    </svg>
  );
}

export function Wheelchair(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="14" cy="18" r="3" />
      <path d="M9 18h2m-5-7h8l-3-4M6 11v7" />
      <circle cx="8" cy="5" r="2" />
    </svg>
  );
}

export function FirstAid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M12 8v8m-4-4h8" />
    </svg>
  );
}

export function Syringe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 2l4 4M4 20l4 4m2-12l8-8M9 15l-5 5m8-8l5-5" />
    </svg>
  );
}

export function Hospital(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 12h6m-3-3v6" />
    </svg>
  );
}