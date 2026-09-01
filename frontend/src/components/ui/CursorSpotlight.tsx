import { useState } from "react";

export interface CursorSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export default function CursorSpotlight({ children, className = "" }: CursorSpotlightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Subtle Light Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}
