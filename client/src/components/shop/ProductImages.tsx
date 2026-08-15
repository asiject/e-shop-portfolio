import {type KeyboardEvent, useEffect, useState} from "react";
import {Box} from "@mui/material";
import NoImage from "./NoImage";
import {kraft} from "theme/kraft";

type ProductImageSource = {
  thumbnail?: string;
  images?: Array<{path?: string}>;
};

type ProductImagesProps = {
  images: string[];
  alt: string;
};

export function collectProductImages(data: ProductImageSource): string[] {
  const paths = [data.thumbnail, ...(data.images ?? []).map(img => img.path)]
    .map(path => (path ?? "").trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const path of paths) {
    const key = path.replace(/^https?:\/\/[^/]+/i, "");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(path);
  }
  return result;
}

const frameSx = {
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  backgroundColor: kraft.window,
} as const;

const imgSx = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
} as const;

export default function ProductImages({images, alt}: ProductImagesProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[index] ?? images[0] ?? "";

  useEffect(() => {
    setIndex(0);
  }, [images]);

  if (count === 0) {
    return (
      <Box sx={frameSx}>
        <NoImage />
      </Box>
    );
  }

  if (count === 1) {
    return (
      <Box sx={frameSx}>
        <Box component="img" src={images[0]} alt={alt} sx={imgSx} />
      </Box>
    );
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setIndex(prev => (prev + 1) % count);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setIndex(prev => (prev - 1 + count) % count);
    }
  };

  return (
    <Box
      tabIndex={0}
      onKeyDown={handleKeyDown}
      sx={{
        "&:focus-visible": {
          outline: `3px solid ${kraft.ink}`,
          outlineOffset: "3px",
        },
      }}>
      <Box sx={frameSx}>
        <Box component="img" src={current} alt={`${alt} ${index + 1}`} sx={imgSx} />
      </Box>
      <Box
        component="nav"
        aria-label="상품 이미지"
        sx={{
          display: "flex",
          gap: 1,
          p: 1.5,
          overflowX: "auto",
          backgroundColor: kraft.sticker,
        }}>
        {images.map((src, i) => {
          const isCurrent = i === index;
          return (
            <Box
              key={`${src}-${i}`}
              component="button"
              type="button"
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`${alt} 이미지 ${i + 1}`}
              onClick={() => setIndex(i)}
              sx={{
                flex: "0 0 auto",
                width: 56,
                height: 56,
                padding: 0,
                border: `2px solid ${isCurrent ? kraft.ink : kraft.paperDeep}`,
                backgroundColor: kraft.window,
                cursor: "pointer",
                overflow: "hidden",
              }}>
              <Box component="img" src={src} alt="" sx={imgSx} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
