import CursorSpotlight from "./CursorSpotlight";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  return (
    <CursorSpotlight
      className={`bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-950/5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200/80 ${className}`}
    >
      <div onClick={onClick} className="h-full">
        {children}
      </div>
    </CursorSpotlight>
  );
}
