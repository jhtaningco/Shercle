import React from 'react';

export default function CswdInboxLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-4 p-4 pt-6 md:p-8">
      {children}
    </div>
  );
}
