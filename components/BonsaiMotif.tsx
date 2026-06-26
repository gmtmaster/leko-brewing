"use client";

export function BonsaiMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 720 420"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <path
        className="bonsai-line"
        d="M358 374c3-61 3-106-1-136-4-31-17-58-39-81m39 81c29-10 56-27 81-52 32-32 61-48 88-48m-169 100c-26 8-54 4-85-12-41-21-79-21-115 0m201 12c-34-25-46-58-34-99 9-31 4-59-16-84m50 183c42 7 76 1 102-18 31-23 63-28 96-15m-198 33c-4-47 12-84 48-112 22-18 32-40 31-66m-78 178c-44-4-77-23-100-59-17-27-42-42-75-46m174 225c33 0 63 6 91 18 32 14 68 13 109-2m-385 3c37-16 72-19 105-8 24 8 51 5 80-10"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="bonsai-line"
        d="M224 379h272c12 0 21 9 21 21H203c0-12 9-21 21-21Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
