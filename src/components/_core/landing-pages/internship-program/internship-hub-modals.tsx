"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BlackFridayOffer from "@/components/_core/landing-pages/internship-program/black-friday-offer";
import ProjectAccessModal from "@/components/_core/landing-pages/internship-program/project-access-modal";

export default function InternshipHubModals() {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [careerTrack, setCareerTrack] = useState<string | null>(null);
  const [projectAccessOpen, setProjectAccessOpen] = useState(false);

  useEffect(() => {
    const track = new URLSearchParams(window.location.search)
      .get("careerTrack")
      ?.trim();
    setCareerTrack(track || null);
    setReady(true);
    if (!track) return;

    const timer = window.setTimeout(() => setProjectAccessOpen(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const clearCareerTrackParam = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("careerTrack")) return;
    params.delete("careerTrack");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setCareerTrack(null);
  }, [pathname, router]);

  const handleProjectAccessChange = useCallback(
    (open: boolean) => {
      setProjectAccessOpen(open);
      if (!open) clearCareerTrackParam();
    },
    [clearCareerTrackParam],
  );

  if (!ready) return null;

  return (
    <>
      {!careerTrack && <BlackFridayOffer />}
      <ProjectAccessModal
        open={projectAccessOpen}
        onOpenChange={handleProjectAccessChange}
        careerTrack={careerTrack}
      />
    </>
  );
}
