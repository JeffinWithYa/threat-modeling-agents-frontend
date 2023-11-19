import React from 'react';

type LandingLayoutProps = {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => (
  <main className="h-full bg-[#1F2937] overflow-auto">
    <div className="mx-auto max-w-screen-xl h-full w-full">
      {children}
    </div>
  </main>
);

export default LandingLayout;