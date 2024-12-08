import React from "react";
function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="w-full h-full overflow-hidden">
      <main>{children}</main>
    </div>
  );
}

export default RootLayout;
