import { StatItem } from "./stat-item";
import { Gem } from "lucide-react";

export const UserStats = () => {
  return (
    <div className="flex items-center gap-3 bg-black/10 backdrop-blur-sm p-1.5 rounded-2xl">
      {/* Dil / Seviye */}
      <StatItem 
        icon={<div className="w-6 h-4.5 rounded-sm bg-gradient-to-r from-green-500 via-white to-red-500 border border-white/20" />} 
        value="29" 
      />

      {/* Gems */}
      <StatItem 
        icon={<Gem size={20} fill="#38BDF8" className="text-[#38BDF8]" />} 
        value="998" 
        colorClassName="text-[#38BDF8]"
      />
    </div>
  );
};