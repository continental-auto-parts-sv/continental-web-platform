import Image from "next/image";
import Link from "next/link";

export function ContinentalLogo({ href = "/" }: { href?: string }) {
  return (
    <Link
      className="wordmark"
      href={href}
      aria-label="Continental Auto Parts, inicio"
    >
      <Image
        src="/images/brands/continental-horizontal.png"
        alt=""
        width={1744}
        height={587}
        sizes="(max-width: 760px) 175px, 230px"
        className="continental-logo continental-logo-light"
      />
      <Image
        src="/images/brands/continental-horizontal-dark.png"
        alt=""
        width={1744}
        height={587}
        sizes="(max-width: 760px) 175px, 230px"
        className="continental-logo continental-logo-dark"
      />
    </Link>
  );
}
