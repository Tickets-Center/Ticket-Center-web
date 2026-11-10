import { useRef } from "react";

const CODE_LENGTH = 6;

export default function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = (value + " ".repeat(CODE_LENGTH))
    .slice(0, CODE_LENGTH)
    .split("");

  const updateValue = (next) => onChange(next.join("").trim());

  const focusInput = (index) => inputs.current[index]?.focus();

  const handleKeyDown = (index, event) => {
    if (event.ctrlKey || event.metaKey) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];

      if (next[index]) {
        next[index] = " ";
      } else if (index > 0) {
        next[index - 1] = " ";
        focusInput(index - 1);
      }

      updateValue(next);
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      const next = [...digits];
      next[index] = event.key;
      updateValue(next);
      if (index < CODE_LENGTH - 1) focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;

    const next = [...digits];
    pasted.split("").forEach((char, index) => {
      next[index] = char;
    });
    updateValue(next);
    focusInput(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  return (
    <div className="otp-input" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onChange={() => {}}
          onClick={() => inputs.current[index]?.select()}
          className="otp-digit"
        />
      ))}
    </div>
  );
}
