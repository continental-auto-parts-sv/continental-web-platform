export function PartIcon({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "engine" && (
        <>
          <path d="M20 28h14v-9h30v9h10l10 12v24H25V54H15V36h5z" />
          <path d="M39 19v-7h20v7M30 37h40M35 47v10m13-10v10m13-10v10M84 42h7v17h-7" />
        </>
      )}
      {kind === "brake" && (
        <>
          <circle cx="47" cy="40" r="29" />
          <circle cx="47" cy="40" r="13" />
          <circle cx="47" cy="40" r="5" />
          <path
            d="M67 14l12 8v27l-12 8-6-9V24z"
            fill="var(--red)"
            stroke="var(--red)"
          />
          <path d="M34 20l-4 5m-4 9-1 6m7 15 5 4m9 3h6m-5-44h5" />
        </>
      )}
      {kind === "spring" && (
        <>
          <path
            d="M46 6h9v14h-9zM46 62h9v12h-9zM39 18h23M39 63h23M40 22l23 8-25 7 25 8-25 7 24 8"
            strokeWidth="4"
          />
          <path d="M46 22v39m9-39v39" opacity=".3" />
        </>
      )}
      {kind === "filter" && (
        <>
          <ellipse cx="50" cy="17" rx="23" ry="8" />
          <path d="M27 17v46c0 11 46 11 46 0V17M33 25v37m8-35v38m9-37v38m9-39v38m8-40v37" />
          <ellipse cx="50" cy="17" rx="10" ry="3" />
        </>
      )}
      {kind === "oil" && (
        <>
          <path d="M35 13h18v11l17 11v34H28V32l7-8zM35 13V7h18v6M55 29l10-12h13v29h-8M36 43h25v18H36z" />
          <path d="M48 45s-7 8-7 11a7 5 0 0 0 14 0c0-3-7-11-7-11z" />
        </>
      )}
      {kind === "other" && (
        <>
          <path d="M46 8h8l2 8c3 .6 5.8 1.8 8.2 3.4l7-4.2 5.6 5.6-4.2 7c1.6 2.4 2.8 5.2 3.4 8.2l8 2v8l-8 2c-.6 3-1.8 5.8-3.4 8.2l4.2 7-5.6 5.6-7-4.2c-2.4 1.6-5.2 2.8-8.2 3.4l-2 8h-8l-2-8c-3-.6-5.8-1.8-8.2-3.4l-7 4.2-5.6-5.6 4.2-7c-1.6-2.4-2.8-5.2-3.4-8.2l-8-2v-8l8-2c.6-3 1.8-5.8 3.4-8.2l-4.2-7 5.6-5.6 7 4.2c2.4-1.6 5.2-2.8 8.2-3.4z" />
          <circle cx="50" cy="42" r="12" />
          <circle cx="50" cy="42" r="4" />
        </>
      )}
    </svg>
  );
}
