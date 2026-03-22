import NextImage, { type ImageProps } from "next/image";

function shouldBypassNextOptimizer(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") {
    return false;
  }
  return src.startsWith("https://") || src.startsWith("http://");
}

type Props = ImageProps;

/**
 * Ինչպես `next/image`, բայց `http(s)` հեռավոր URL-ների համար `unoptimized` —
 * խուսափում է `/_next/image` սերվերի fetch-ից (Next-ը 7 վրկ-ից հետո TimeoutError է տալիս)։
 * Տեղական `/…` ֆայլերը շարունակում են անցնել օպտիմիզատորով։
 */
export function RemoteAwareImage(props: Props) {
  const unoptimized = props.unoptimized ?? shouldBypassNextOptimizer(props.src);
  return <NextImage {...props} unoptimized={unoptimized} />;
}
