import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  colorClassName?: string;
}

export const StatItem = ({ icon, value, colorClassName }: StatItemProps) => {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 transition-all">
      <div className="shrink-0">
        {icon}
      </div>
      <span className={cn(
        "text-[17px] font-black tracking-tight font-fredoka",
        colorClassName || "text-white"
      )}>
        {value}
      </span>
    </div>
  );
};

/* CN FONKSİYONU NOTU:
  cn fonksiyonu, clsx ve tailwind-merge kütüphanelerini birleştirir. 
  1. isActive && "bg-blue-500" gibi koşullu sınıfları temiz yönetmeyi sağlar. 
  2. Tailwind sınıfları çakıştığında (örneğin p-2 ve p-4 aynı anda gelirse) 
     en sondaki sınıfın geçerli olmasını sağlayarak stil hatalarını önler.
*/