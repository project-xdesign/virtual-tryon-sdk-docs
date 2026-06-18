import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-container-wrapper">
      <Header />
      <div className="app-container">
        <Sidebar />
        <div style={{ flexGrow: 1, minWidth: 0, position: "relative" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
