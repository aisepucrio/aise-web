"use client";

type MinimalButtonProps = {
  href: string;
  text: string;
  ariaLabel?: string;
};

export default function MinimalButton({
  href,
  text,
  ariaLabel,
}: MinimalButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel || text}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: 600,
        color: "#000",
        textDecoration: "none",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        backgroundColor: "transparent",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--primary)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.2)";
      }}
    >
      {text} →
    </a>
  );
}
