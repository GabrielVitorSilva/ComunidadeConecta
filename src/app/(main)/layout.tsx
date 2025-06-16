// src/app/(main)/layout.tsx
import React from 'react';

// This layout applies to all routes within the (main) group.
// It can be used for shared UI elements specific to the main app section,
// like a sidebar for navigation if AppHeader wasn't global.
// For now, it just renders children as AppHeader is in the root layout.

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
