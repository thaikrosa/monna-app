import { ChatAnimation } from './ChatAnimation';

export function PhoneMockup() {
  return (
    <div className="relative animate-[float_6s_ease-in-out_infinite]">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Phone Frame */}
      <div className="relative w-[280px] sm:w-[300px] bg-gradient-to-br from-[#2D0A0D] to-foreground rounded-[40px] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="bg-card rounded-[32px] overflow-hidden">
          <ChatAnimation />
        </div>
      </div>
    </div>
  );
}
