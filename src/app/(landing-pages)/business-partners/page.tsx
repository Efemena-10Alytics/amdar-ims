import BecomeAPartner from "@/components/_core/landing-pages/business-partners/become-a-partner";
import BusinessPartnersHero from "@/components/_core/landing-pages/business-partners/hero";
import LiveProject from "@/components/_core/landing-pages/business-partners/live-project";
import OutsourcingWork from "@/components/_core/landing-pages/business-partners/outsourcing-work";
import SmallAsk from "@/components/_core/landing-pages/business-partners/small-ask";
import ThreeStep from "@/components/_core/landing-pages/business-partners/three-step";

export default function BusinessPartnersPage() {
  return (
    <main>
      <BusinessPartnersHero />
      <OutsourcingWork />
      <SmallAsk />
      <LiveProject />
      <ThreeStep />
      <BecomeAPartner />
    </main>
  );
}
