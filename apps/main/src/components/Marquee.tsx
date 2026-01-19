import * as React from "react";

export type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Higher value -> faster scroll. */
  speed?: number;
  /** Reverse the scroll direction */
  reverse?: boolean;
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Gap between items */
  gap?: string;
  children: React.ReactNode;
};

export function Marquee({
  children,
  className = "",
  speed = 30,
  reverse = false,
  pauseOnHover = true,
  gap = "1rem",
  style,
  ...props
}: MarqueeProps) {
  const duration = Math.max(5, Math.round(100 / Math.max(1, speed))); // seconds, clamp to sensible minimum

  React.useEffect(() => {
    const id = "aise-marquee-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.innerHTML = `
        @keyframes aise-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes aise-marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `;
      document.head.appendChild(s);
    }
  }, []);

  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      style={style}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      {...props}
    >
      <div
        style={{
          display: "inline-flex",
          gap,
          whiteSpace: "nowrap",
          willChange: "transform",
          animation: `${
            reverse ? "aise-marquee-reverse" : "aise-marquee"
          } ${duration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
        aria-hidden={false}
      >
        <div style={{ display: "inline-flex", gap }}>{children}</div>
        <div style={{ display: "inline-flex", gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
