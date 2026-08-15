import {Box} from "@mui/material";
import {kraft} from "theme/kraft";

type QuantityStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  labelledBy?: string;
};

export default function QuantityStepper({value, min, max, onChange, labelledBy}: QuantityStepperProps) {
  const handleStep = (next: number) => {
    if (next < min) return;
    if (next > max) {
      if (max >= 10000) {
        alert("1만개 이하만 주문할 수 있습니다");
      }
      return;
    }
    onChange(next);
  };

  const btnSx = {
    width: 32,
    height: 32,
    padding: 0,
    border: 0,
    background: kraft.sticker,
    color: kraft.ink,
    font: "inherit",
    fontSize: 18,
    lineHeight: 1,
    cursor: "pointer",
    "&:disabled": {color: kraft.mute, cursor: "not-allowed"},
  } as const;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        border: `2px solid ${kraft.ink}`,
        backgroundColor: kraft.sticker,
      }}>
      <Box
        component="button"
        type="button"
        aria-label="수량 줄이기"
        disabled={value <= min}
        onClick={() => handleStep(value - 1)}
        sx={btnSx}>
        −
      </Box>
      <Box
        aria-labelledby={labelledBy}
        aria-live="polite"
        sx={{
          minWidth: 40,
          textAlign: "center",
          fontFamily: kraft.mono,
          fontVariantNumeric: "tabular-nums",
          fontSize: 14,
          fontWeight: 600,
        }}>
        {value}
      </Box>
      <Box
        component="button"
        type="button"
        aria-label="수량 늘리기"
        disabled={value >= max}
        onClick={() => handleStep(value + 1)}
        sx={btnSx}>
        +
      </Box>
    </Box>
  );
}
