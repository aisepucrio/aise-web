import React from "react";

export const metadata = {
  title: "Research — Under Construction",
};

export default function Page() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Page under construction
        </h1>
        <p style={{ color: "#555" }}>
          Sorry — this page is still under development. Please check back soon!
        </p>
      </div>
    </main>
  );
}
