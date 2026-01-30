import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  buttonText: string;
  dataAos?: string;
  dataAosDuration?: string;
}

const ServiceCard = ({
  title,
  description,
  buttonText,
  dataAos,
  dataAosDuration,
}: ServiceCardProps) => {
  return (
    <div
      data-aos={dataAos}
      data-aos-duration={dataAosDuration}
      className="bg-[#135A6A] rounded-lg p-6 lg:p-8"
    >
      <h3 className="text-xl lg:text-[22px] font-semibold mb-4">{title}</h3>
      <p className="text-white/80 mb-6 text-sm">{description}</p>
      <Button
        className={cn(
          "bg-transparent text-white hover:bg-white/10 rounded-full",
          "flex items-center gap-2 w-full justify-start",
        )}
      >
        {buttonText}
        <div className="flex justify-center items-center h-6 w-6 bg-[#156374] rounded-full">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </Button>
    </div>
  );
};

export default ServiceCard;
