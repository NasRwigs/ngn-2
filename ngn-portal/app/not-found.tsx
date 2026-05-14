import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center p-6 bg-surface">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-display-lg text-primary font-bold">404</h1>
        <p className="text-body-lg text-on-surface">Page not found.</p>
        <p className="text-body-md text-on-surface-variant">
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
