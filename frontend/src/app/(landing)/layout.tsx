import Footer from "@/components/Footer";
import React from "react";

function homeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-hidden!">
      {children}
      <Footer />
    </div>
  );
}

export default homeLayout;
