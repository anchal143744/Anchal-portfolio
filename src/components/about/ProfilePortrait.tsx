import Image from "next/image";

type ProfilePortraitProps = { src?: string; alt?: string };

export function ProfilePortrait({ src, alt = "Portrait of Anchal Sharma" }: ProfilePortraitProps) {
  return <figure className="about-portrait">
    {src ? <Image src={src} alt={alt} fill sizes="(max-width: 600px) 90vw, 38vw" /> : <div className="portrait-placeholder" role="img" aria-label="Portrait space reserved for Anchal Sharma">
      <span>AS</span><i /><i /><small>PORTRAIT / FORTHCOMING</small>
    </div>}
  </figure>;
}
