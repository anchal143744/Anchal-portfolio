import Image from "next/image";

type ProfilePortraitProps = { src?: string; alt?: string; objectPosition?: string };

export function ProfilePortrait({ src, alt = "Professional portrait of Anchal Sharma", objectPosition = "50% 17%" }: ProfilePortraitProps) {
  if (!src) return null;
  return <figure className="v4-portrait">
    <Image src={src} alt={alt} fill priority quality={75} sizes="(max-width: 767px) 82vw, 43vw" style={{ objectFit: "cover", objectPosition }} />
    <span aria-hidden="true" />
  </figure>;
}
