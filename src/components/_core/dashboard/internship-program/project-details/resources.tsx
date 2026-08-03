"use client";

import Resources from "../internship-details/resources";

type ResourcesDetailsProps = {
  programId?: number | string | null;
  cohortId?: number | string | null;
};

export default function ResourcesDetails({
  programId,
  cohortId,
}: ResourcesDetailsProps) {
  return <Resources programId={programId} cohortId={cohortId} />;
}
