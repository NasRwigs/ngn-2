"use client";

import * as React from "react";

import { cn } from "./cn";
import { Tag } from "./tag";

interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  max?: number;
  className?: string;
  ariaLabel?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tag…",
  suggestions = [],
  max,
  className,
  ariaLabel = "Tags",
}: TagInputProps) {
  const [input, setInput] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const filteredSuggestions = React.useMemo(() => {
    const lower = input.toLowerCase().trim();
    if (!lower) return [];
    return suggestions
      .filter(
        (s) =>
          !value.includes(s) && s.toLowerCase().includes(lower),
      )
      .slice(0, 6);
  }, [input, suggestions, value]);

  function add(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    if (max && value.length >= max) return;
    onChange([...value, trimmed]);
    setInput("");
    setHighlight(0);
  }

  function handleKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const pick = filteredSuggestions[highlight] ?? input;
      add(pick);
    } else if (event.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((h) => Math.min(filteredSuggestions.length - 1, h + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex flex-wrap items-center gap-1.5 min-h-11 rounded border",
          "border-outline-variant bg-surface-container-lowest",
          "px-2 py-1.5",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Tag
            key={tag}
            selected
            size="sm"
            onRemove={() => onChange(value.filter((v) => v !== tag))}
          >
            {tag}
          </Tag>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKey}
          placeholder={value.length === 0 ? placeholder : ""}
          aria-label={ariaLabel}
          className="flex-1 min-w-[8rem] bg-transparent text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none"
        />
      </div>

      {filteredSuggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label={`${ariaLabel} suggestions`}
          className="rounded border border-outline-variant bg-surface-container-lowest shadow-level-1 max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(event) => {
                event.preventDefault();
                add(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={cn(
                "px-3 py-2 text-sm cursor-pointer",
                i === highlight
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface",
              )}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {max && (
        <p className="text-xs text-on-surface-variant">
          {value.length} / {max}
        </p>
      )}
    </div>
  );
}
