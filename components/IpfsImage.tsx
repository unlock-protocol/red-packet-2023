import Image, { ImageProps } from "next/image";

export const IpfsImage = ({ src, ...rest }: ImageProps) => {
  if (src) {
    // @ts-expect-error
    src = src.replace(/^ipfs:\/\//, "https://gateway.pinata.cloud/ipfs/");
  }
  return <Image {...rest} src={src} />;
};
