import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      className="flex flex-col justify-between bg-[#135A6A] hover:bg-transparent hover:text-white p-6 lg:p-8 text-[#B6CFD4] group transition-colors duration-300"
    >
      <div>
        <h3 className="text-xl lg:text-[22px] font-semibold mb-4">{title}</h3>
        <p className="mb-6 text-sm">{description}</p>
      </div>
      <Link href="/internship-program">
        <Button
          // variant={"link"}
          className={cn(
            "bg-transparent rounded-full p-0 hover:p-4 hover:bg-transparent",
            "inline-flex items-center gap-2 justify-start text-[#B6CFD4]!",
          )}
        >
          {buttonText}
          <div className="flex justify-center items-center h-6 w-6 bg-[#156374] group-hover:bg-amdari-yellow group-hover:text-primary rounded-full">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default ServiceCard;
