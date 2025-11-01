import Image from "next/image";
import { Media } from "../../payload-types";

interface PayloadImageProps {
  image: Media;
  alt?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function PayloadImage({
  image,
  alt,
  priority = false,
  className,
  sizes,
}: PayloadImageProps) {
  if (!image || typeof image !== "object") {
    return null;
  }

  return (
    <Image
      src={image.url || ""}
      alt={alt || image.alt || ""}
      width={800}
      height={600}
      sizes={sizes || "100vw"}
      priority={priority}
      unoptimized={true}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL || undefined}
      className={className}
    />
  );
}