import type { AppProps } from "next/app"

import "normalize.css/normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "./index.css"

export default function App ({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}