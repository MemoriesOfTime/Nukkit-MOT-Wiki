import React, { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import NationalDayTheme from '@site/src/components/NationalDayTheme';

interface RootProps {
  children: ReactNode;
}

// Root component wraps the entire application
// This is the recommended way to add global components in Docusaurus
export default function Root({ children }: RootProps): ReactNode {
  return (
    <>
      <NationalDayTheme />
      {children}
      <Analytics />
    </>
  );
}
