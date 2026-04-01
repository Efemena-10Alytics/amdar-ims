import { CreatePortfolioForm } from "@/components/_core/dashboard/portfolio";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CreatePortfolio = () => {
  return (
    <div className="h-full p-5 space-y-">
      <CreatePortfolioForm />
    </div>
  );
};

export default CreatePortfolio;
