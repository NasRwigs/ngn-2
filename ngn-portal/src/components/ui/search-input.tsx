"use client";

import { Search, X } from "lucide-react";

import { Input } from "./input";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export function SearchInput({ onClear, value, ...props }: SearchInputProps) {
  return (
    <Input
      type="search"
      role="searchbox"
      value={value}
      leading={<Search className="size-4" aria-hidden />}
      trailing={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="pointer-events-auto size-6 grid place-items-center rounded-full hover:bg-surface-container"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null
      }
      {...props}
    />
  );
}
