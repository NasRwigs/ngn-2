import * as React from "react";

import { cn } from "./cn";

type CardAccent = "blue" | "orange" | "lime" | "red" | "none";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: CardAccent;
  elevation?: "level-0" | "level-1" | "level-2";
}

const ACCENT: Record<CardAccent, string> = {
  none: "",
  blue: "border-t-4 border-t-primary",
  orange: "border-t-4 border-t-secondary-container",
  lime: "border-t-4 border-t-tertiary-container",
  red: "border-t-4 border-t-error",
};

const ELEV = {
  "level-0": "",
  "level-1": "shadow-level-1",
  "level-2": "shadow-level-2",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    accent = "none",
    elevation = "level-1",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface-container-lowest rounded-lg",
        ELEV[elevation],
        ACCENT[accent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 md:p-6", className)} {...props} />;
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 md:p-6 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 md:p-6 pt-0 flex items-center gap-2 justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-headline-md text-on-surface", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-body-md text-on-surface-variant mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
}
