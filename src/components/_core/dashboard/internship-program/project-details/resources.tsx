"use client";

import Resources from "../internship-details/resources";

type ResourcesDetailsProps = {
  projectId?: number | string | null;
};

export default function ResourcesDetails({ projectId }: ResourcesDetailsProps) {
  return <Resources projectId={projectId} />;
}
