import { imageBaseurl } from "@/lib/utils";
import { CareerOpportunity } from "@/types/internship-program";
import Image from "next/image";

interface CareerOpporturnityProps {
  careerOpporturnity: CareerOpportunity[] | undefined;
}

const CareerOpporturnity = ({
  careerOpporturnity,
}: CareerOpporturnityProps) => {

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#092A31] mb-6">
        Career Opporturnity
      </h2>

      <div className="flex flex-wrap gap-3">
        {careerOpporturnity?.map((item, index) => (
          <div
            key={item?.id ?? index}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200"
          >
            {item.icon ? (
              <Image
                src={`${imageBaseurl}/${item.icon}`}
                alt={item.text ?? "Career opportunity"}
                width={16}
                height={16}
                className="object-contain"
              />
            ) : null}
            <span className="text-sm text-[#092A31] font-medium">
              {item?.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerOpporturnity;
