import {Box} from "@mui/material";
import {kraft} from "theme/kraft";

type ProductEditorBodyProps = {
  html?: string;
};

const stripScripts = (raw: string) => raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

export default function ProductEditorBody({html}: ProductEditorBodyProps) {
  const raw = (html ?? "").trim();
  if (!raw) {
    return (
      <Box sx={{color: kraft.mute, fontSize: 14}}>
        상세 설명이 없습니다.
      </Box>
    );
  }

  const safe = stripScripts(raw);
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(safe);
  if (!isHtml) {
    return (
      <Box sx={{whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.45, color: kraft.ink}}>
        {safe}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        fontSize: 14,
        lineHeight: 1.45,
        color: kraft.ink,
        p: {margin: "0 0 12px"},
        img: {maxWidth: "100%", display: "block"},
      }}
      dangerouslySetInnerHTML={{__html: safe}}
    />
  );
}
