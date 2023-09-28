import Head from "next/head"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface OpenGraphProps {
  title?: string;
  description?: string;
  media?: string;
  children?: ReactNode;
}

export function OpenGraph (props: OpenGraphProps) {
  const router = useRouter();
  const title = props.title ? `${props.title} - Fill 3D` : "Fill 3D";
  const description = props.description ?? "Generative Fill in 3D.";
  const media = props.media ?? "/icon.png";
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/icon_transparent.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_WEB_URL}/${router.pathname}`} />
      <meta property="og:title" content={title} />
      <meta property="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={media} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {props.children}
    </Head>
  );
}