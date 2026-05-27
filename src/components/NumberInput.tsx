import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  value: number;
  onChange: (n: number) => void;
  className?: string;
}

const parse = (s: string) => {
  const n = parseFloat(s.replace(",", "."));
  return isNaN(n) ? 0 : n;
};

export default function NumberInput({ value, onChange, className }: Props) {
  const [text, setText] = useState<string>(() => String(value ?? 0).replace(".", ","));

  // Sync external value only when it differs from parsed local text
  useEffect(() => {
    if (parse(text) !== value) setText(String(value ?? 0).replace(".", ","));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      inputMode="decimal"
      className={className}
      value={text}
      onChange={(e) => {
        const v = e.target.value;
        // allow digits, comma, dot, minus
        if (!/^-?[\d.,]*$/.test(v)) return;
        setText(v);
        onChange(parse(v));
      }}
      onBlur={() => {
        const n = parse(text);
        setText(String(n).replace(".", ","));
      }}
    />
  );
}
