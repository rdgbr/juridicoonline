import Link from "next/link";

export function Logo({ size = 28, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Jurídico Online">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="#0F4C81" />
        <path
          d="M16 6 L16 26 M9 11 L23 11 M11 11 L8 19 C8 20.5 9.5 22 11 22 C12.5 22 14 20.5 14 19 L11 11 Z M21 11 L18 19 C18 20.5 19.5 22 21 22 C22.5 22 24 20.5 24 19 L21 11 Z"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="6" r="1.5" fill="#10B981" />
      </svg>
      {withText && (
        <span className="font-semibold text-[15px] tracking-tight">
          <span className="text-[#0F4C81]">Jurídico</span>
          <span className="text-[#10B981]"> Online</span>
        </span>
      )}
    </Link>
  );
}
