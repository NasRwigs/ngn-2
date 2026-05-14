import * as React from "react";

import { cn } from "./cn";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Show on mobile cards. Default true. */
  mobile?: boolean;
  /** Use as the primary heading in mobile cards. */
  primary?: boolean;
  width?: string;
  className?: string;
}

export type TableColumn<T> = Column<T>;

interface ResponsiveTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  keyOf: (row: T) => string;
  caption?: string;
  rowHref?: (row: T) => string;
  empty?: React.ReactNode;
  className?: string;
}

export function ResponsiveTable<T>({
  rows,
  columns,
  keyOf,
  caption,
  rowHref,
  empty,
  className,
}: ResponsiveTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <>
      <div
        className={cn(
          "hidden md:block overflow-x-auto rounded-lg border border-outline-variant",
          "bg-surface-container-lowest",
          className,
        )}
      >
        <table className="w-full text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width }}
                  className={cn(
                    "text-left px-4 py-3 font-medium text-on-surface-variant",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const href = rowHref?.(row);
              return (
                <tr
                  key={keyOf(row)}
                  className={cn(
                    "border-b border-outline-variant last:border-0",
                    href && "hover:bg-surface-container cursor-pointer",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-on-surface", col.className)}
                    >
                      {href ? (
                        <a
                          href={href}
                          className="block focus:outline-none focus-visible:underline"
                        >
                          {col.cell(row)}
                        </a>
                      ) : (
                        col.cell(row)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden space-y-2">
        {rows.map((row) => {
          const visible = columns.filter((c) => c.mobile !== false);
          const primary = visible.find((c) => c.primary) ?? visible[0];
          const rest = visible.filter((c) => c !== primary);
          const href = rowHref?.(row);
          const inner = (
            <div
              className={cn(
                "rounded-lg border border-outline-variant bg-surface-container-lowest p-4 space-y-1.5",
                href && "hover:bg-surface-container",
              )}
            >
              {primary && (
                <div className="font-medium text-on-surface">
                  {primary.cell(row)}
                </div>
              )}
              <dl className="space-y-1 text-sm">
                {rest.map((col) => (
                  <div
                    key={col.key}
                    className="flex justify-between gap-3"
                  >
                    <dt className="text-on-surface-variant">{col.header}</dt>
                    <dd className="text-on-surface text-right">
                      {col.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
          return (
            <li key={keyOf(row)}>
              {href ? (
                <a
                  href={href}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
