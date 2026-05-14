"use client";

import * as React from "react";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/tag";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/modal";
import { cn } from "@/components/ui/cn";

export interface FilterDef {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface FilterBarProps {
  filters: FilterDef[];
  value: Record<string, string | undefined>;
  onChange: (next: Record<string, string | undefined>) => void;
  resultCount?: number;
  className?: string;
}

export function FilterBar({
  filters,
  value,
  onChange,
  resultCount,
  className,
}: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const activeCount = Object.values(value).filter(Boolean).length;

  function toggle(key: string, optionValue: string) {
    onChange({
      ...value,
      [key]: value[key] === optionValue ? undefined : optionValue,
    });
  }

  return (
    <div className={cn("", className)}>
      <div className="hidden md:flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm text-on-surface-variant mr-1">
              {filter.label}:
            </span>
            {filter.options.map((opt) => (
              <FilterChip
                key={opt.value}
                selected={value[filter.key] === opt.value}
                onClick={() => toggle(filter.key, opt.value)}
              >
                {opt.label}
              </FilterChip>
            ))}
          </div>
        ))}
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({})}
            className="ml-auto"
          >
            <X className="size-3.5" aria-hidden />
            Clear
          </Button>
        )}
        {typeof resultCount === "number" && (
          <span className="text-sm text-on-surface-variant ml-auto">
            {resultCount} results
          </span>
        )}
      </div>

      <div className="md:hidden flex items-center justify-between gap-2">
        <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="size-4" aria-hidden />
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Button>
          </DialogTrigger>
          <DialogContent layout="sheet">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-5">
              {filters.map((filter) => (
                <fieldset key={filter.key}>
                  <legend className="text-sm font-medium text-on-surface mb-2">
                    {filter.label}
                  </legend>
                  <div className="flex flex-wrap gap-1.5">
                    {filter.options.map((opt) => (
                      <FilterChip
                        key={opt.value}
                        selected={value[filter.key] === opt.value}
                        onClick={() => toggle(filter.key, opt.value)}
                      >
                        {opt.label}
                      </FilterChip>
                    ))}
                  </div>
                </fieldset>
              ))}
            </DialogBody>
            <DialogFooter>
              {activeCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => onChange({})}
                  className="md:order-1"
                >
                  Clear all
                </Button>
              )}
              <Button onClick={() => setSheetOpen(false)}>
                Apply{resultCount != null ? ` (${resultCount})` : ""}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {typeof resultCount === "number" && (
          <span className="text-sm text-on-surface-variant">
            {resultCount} results
          </span>
        )}
      </div>
    </div>
  );
}
