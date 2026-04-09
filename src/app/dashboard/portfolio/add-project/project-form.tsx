"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CameraIcon,
  Check,
  Cloud,
  FileText,
  Link2,
  Square,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { YourToolsData } from "@/components/_core/dashboard/portfolio/your-tools";
import { ToolIcon } from "@/components/_core/dashboard/portfolio/your-tools";
import { AddToolsPopover } from "@/components/_core/dashboard/portfolio/add-tools-popover";
import { portfolioInputStyle } from "@/components/_core/dashboard/portfolio/portfolio-styles";
import { cn, getImageUrl } from "@/lib/utils";
import { useGetTools } from "@/features/portfolio/use-get-tools";
import type { AddProjectFormData } from "@/features/portfolio/build-project-form-data";
import type { UserPortfolioProjectDetail } from "@/features/portfolio/use-get-project-by-id";

const TOOL_IMAGES: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
  Sketch: "/images/svgs/tools/sketch.svg",
  Jira: "/images/svgs/tools/jira.svg",
  Photoshop: "/images/svgs/tools/photoshop.svg",
  Canva: "/images/svgs/tools/canva.svg",
  "Adobe illustration": "/images/svgs/tools/adobe-illustrator.svg",
  Trello: "/images/svgs/tools/trello.svg",
  "Light room": "/images/svgs/tools/light-room.svg",
};

function isPdfAsset(src: string): boolean {
  return src.toLowerCase().includes(".pdf");
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function openPdfInNewTab(src: string) {
  if (typeof window === "undefined") return;
  window.open(src, "_blank", "noopener,noreferrer");
}

export type ProjectFormProps = {
  headline: { title: string; subtitle: string };
  backHref: string;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  errorMessage: string;
  onSubmit: (data: AddProjectFormData) => Promise<boolean>;
  initialProject?: UserPortfolioProjectDetail | null;
  /** Stable key for prefill when API omits `id` on the project (e.g. route param). */
  prefillKey?: string | null;
};

export function ProjectForm({
  headline,
  backHref,
  submitLabel,
  submittingLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
  initialProject,
  prefillKey,
}: ProjectFormProps) {
  const [toolsData, setToolsData] = useState<YourToolsData>({
    selectedTools: [],
  });
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [overview, setOverview] = useState("");
  const [summary, setSummary] = useState("");
  const [problem, setProblem] = useState("");
  const [role, setRole] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [shouldFocusNewFeature, setShouldFocusNewFeature] = useState(false);
  const [challengesAndSolutions, setChallengesAndSolutions] = useState("");
  const [impactAndOutcomes, setImpactAndOutcomes] = useState("");
  const [durationBreakdown, setDurationBreakdown] = useState("");
  const [solutionUrl, setSolutionUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [remoteCoverUrl, setRemoteCoverUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [selectedGalleryKey, setSelectedGalleryKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFilesInputRef = useRef<HTMLInputElement>(null);
  const firstFeatureInputRef = useRef<HTMLInputElement>(null);
  const prefilledKeyRef = useRef<string | null>(null);

  const { data: apiTools = [] } = useGetTools();

  const toolNameToIcon = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of apiTools) {
      const name = t.name?.trim();
      const icon = t.icon ?? t.url ?? t.image;
      if (name && icon) map[name] = getImageUrl(icon);
    }
    return map;
  }, [apiTools]);

  useEffect(() => {
    if (!initialProject) return;
    const key = String(
      prefillKey ?? initialProject.id ?? "",
    ).trim();
    if (!key || prefilledKeyRef.current === key) return;
    prefilledKeyRef.current = key;

    setTitle(initialProject.title?.trim() ?? "");
    setCategory(initialProject.category?.trim() ?? "");
    setDuration(initialProject.duration?.trim() ?? "");
    setOverview(initialProject.overview?.trim() ?? "");
    setSummary(initialProject.summary?.trim() ?? "");
    setProblem(initialProject.problem?.trim() ?? "");
    setRole(initialProject.role?.trim() ?? "");
    setFeatures(
      initialProject.features && initialProject.features.length > 0
        ? initialProject.features
        : [""],
    );
    setChallengesAndSolutions(
      initialProject.challengesAndSolutions?.trim() ?? "",
    );
    setImpactAndOutcomes(initialProject.impactAndOutcomes?.trim() ?? "");
    setDurationBreakdown(initialProject.durationBreakdown?.trim() ?? "");
    setSolutionUrl(initialProject.solutionUrl?.trim() ?? "");
    setMediaUrl(initialProject.mediaUrl?.trim() ?? "");

    const names: string[] = [];
    const custom: Record<string, string> = {};
    for (const t of initialProject.tools ?? []) {
      const n = (t.title ?? t.name)?.trim();
      if (!n) continue;
      names.push(n);
      const img = getImageUrl(t.image ?? t.url ?? undefined);
      if (img) custom[n] = img;
    }
    setToolsData({
      selectedTools: names,
      customToolImages:
        Object.keys(custom).length > 0 ? custom : undefined,
    });

    setRemoteCoverUrl(getImageUrl(initialProject.coverImage) || null);
    setCoverFile(null);
    setCoverPreview(null);
    setProjectFiles([]);
    const gallery = (initialProject.projectFiles ?? [])
      .map((u) => getImageUrl(u))
      .filter((u): u is string => !!u);
    setExistingGalleryUrls(gallery);
  }, [initialProject, prefillKey]);

  useEffect(() => {
    if (!shouldFocusNewFeature) return;
    firstFeatureInputRef.current?.focus();
    setShouldFocusNewFeature(false);
  }, [features, shouldFocusNewFeature]);

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const clearCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    setRemoteCoverUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const MAX_PROJECT_FILES = 6;
  const totalGalleryCount = existingGalleryUrls.length + projectFiles.length;
  const canAddMoreFiles = totalGalleryCount < MAX_PROJECT_FILES;

  const onProjectFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setProjectFiles((prev) => {
      const room = MAX_PROJECT_FILES - existingGalleryUrls.length - prev.length;
      if (room <= 0) return prev;
      return [...prev, ...files.slice(0, room)];
    });
    if (projectFilesInputRef.current) projectFilesInputRef.current.value = "";
  };
  const removeProjectFile = (index: number) => {
    setProjectFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const [projectPreviews, setProjectPreviews] = useState<string[]>([]);
  useEffect(() => {
    const urls = projectFiles.map((f) => URL.createObjectURL(f));
    setProjectPreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return urls;
    });
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [projectFiles]);

  const coverDisplaySrc = coverPreview ?? remoteCoverUrl;
  const isCreateMode = !initialProject;
  const hasAtLeastOneProjectFile = totalGalleryCount > 0;
  const hasRequiredCreateFields = useMemo(() => {
    const hasText = (value: string) => value.trim().length > 0;
    const hasFeature = features.some((item) => item.trim().length > 0);
    return (
      hasText(title) &&
      hasText(category) &&
      hasText(duration) &&
      hasText(overview) &&
      hasText(summary) &&
      hasText(problem) &&
      hasText(role) &&
      hasFeature &&
      hasText(challengesAndSolutions) &&
      hasText(impactAndOutcomes) &&
      hasText(durationBreakdown) &&
      toolsData.selectedTools.length > 0 &&
      !!coverDisplaySrc &&
      hasAtLeastOneProjectFile
    );
  }, [
    title,
    category,
    duration,
    overview,
    summary,
    problem,
    role,
    features,
    challengesAndSolutions,
    impactAndOutcomes,
    durationBreakdown,
    toolsData.selectedTools,
    coverDisplaySrc,
    hasAtLeastOneProjectFile,
  ]);
  const isSubmitDisabled = isSubmitting || (isCreateMode && !hasRequiredCreateFields);
  const galleryItems = useMemo(
    () => [
      ...existingGalleryUrls.map((url, index) => ({
        key: `ex-${index}`,
        src: url,
        isPdf: isPdfAsset(url),
        label: url.split("/").pop() ?? "PDF file",
        remove: () => removeExistingGalleryImage(index),
        removeLabel: "Remove image from list",
      })),
      ...projectPreviews.map((src, index) => ({
        key: `new-${index}`,
        src,
        isPdf: !!projectFiles[index] && isPdfFile(projectFiles[index]),
        label: projectFiles[index]?.name ?? "PDF file",
        remove: () => removeProjectFile(index),
        removeLabel: `Remove ${projectFiles[index]?.name ?? "image"}`,
      })),
    ],
    [existingGalleryUrls, projectFiles, projectPreviews],
  );
  useEffect(() => {
    if (galleryItems.length === 0) {
      setSelectedGalleryKey(null);
      return;
    }

    if (
      selectedGalleryKey == null ||
      !galleryItems.some((item) => item.key === selectedGalleryKey)
    ) {
      setSelectedGalleryKey(galleryItems[0].key);
    }
  }, [galleryItems, selectedGalleryKey]);

  const mainGalleryItem =
    galleryItems.find((item) => item.key === selectedGalleryKey) ?? galleryItems[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isCreateMode && !hasRequiredCreateFields) return;
    const tools = toolsData.selectedTools.map((name) => {
      const fromCustom = toolsData.customToolImages?.[name];
      const image =
        (fromCustom && !fromCustom.startsWith("blob:")
          ? fromCustom
          : undefined) ??
        toolNameToIcon[name] ??
        TOOL_IMAGES[name];
      return { name, ...(image && { image }) };
    });
    const ok = await onSubmit({
      title,
      category,
      duration,
      overview,
      summary,
      problem,
      role,
      features: features.map((item) => item.trim()).filter(Boolean),
      challengesAndSolutions,
      impactAndOutcomes,
      durationBreakdown,
      solutionUrl,
      mediaUrl,
      tools,
      coverFile,
      projectFiles,
      retainCoverImageUrl:
        !coverFile &&
          remoteCoverUrl &&
          !remoteCoverUrl.startsWith("blob:")
          ? remoteCoverUrl
          : undefined,
      retainImageUrls:
        existingGalleryUrls.length > 0
          ? [...existingGalleryUrls]
          : undefined,
    });
    if (ok) prefilledKeyRef.current = null;
  };

  return (
    <div className="min-h-full flex flex-col p-5">
      <header className="border-b border-zinc-200 bg-white py-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-[#76808D] hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
        <h1 className="text-lg font-semibold text-[#092A31] mt-2">
          {headline.title}
        </h1>
        <p className="text-sm text-[#A1A8B1] mt-1">{headline.subtitle}</p>
      </header>

      <form
        className="flex-1 py-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12"
        onSubmit={handleSubmit}
      >
        <div className="rounded-xl h-fit bg-[#F8FAFC] p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Your Tools</h2>
          <p className="text-sm text-zinc-500 mt-1 mb-4">
            Select the tools you used in this project
          </p>
          <AddProjectToolsSection
            value={toolsData}
            onChange={setToolsData}
            projectCategory={category}
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Cover image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onCoverChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full rounded-lg border-primary/40 bg-[#B6CFD4] min-h-45 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/10 transition-colors",
                coverDisplaySrc && "relative overflow-hidden",
              )}
            >
              {coverDisplaySrc ? (
                <>
                  <img
                    src={coverDisplaySrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="relative z-10 text-sm font-medium text-white drop-shadow-md">
                    Change image
                  </span>
                </>
              ) : (
                <>
                  <Cloud className="size-10" aria-hidden />
                  <span className="text-sm font-medium">Upload cover image</span>
                  <span className="text-xs text-zinc-500">
                    PNG, JPEG, GIF, WebP (max 5mb)
                  </span>
                </>
              )}
            </button>
            {coverDisplaySrc && (
              <button
                type="button"
                onClick={clearCover}
                className="mt-2 text-sm text-zinc-500 hover:text-zinc-700"
              >
                Remove image
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-title"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project title
            </label>
            <Input
              id="project-title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={portfolioInputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label
                htmlFor="project-category"
                className="block text-sm font-semibold text-zinc-900"
              >
                Project category
              </label>
              <Input
                id="project-category"
                placeholder="Eg Branding, Graphics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={portfolioInputStyle}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="project-duration"
                className="block text-sm font-semibold text-zinc-900"
              >
               Project Duration
              </label>
              <Input
                id="project-duration"
                placeholder="Eg 4 Weeks"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={portfolioInputStyle}
              />
            </div>
          </div>


          <div className="space-y-2">
            <label
              htmlFor="project-overview"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project overview
            </label>
            <textarea
              id="project-overview"
              placeholder="Give an overview & description of this project"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-summary"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project summary
            </label>
            <textarea
              id="project-summary"
              placeholder="Summarize the project and what it accomplishes"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-problem"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project problem & context
            </label>
            <textarea
              id="project-problem"
              placeholder="Describe the problem this project solves"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-role"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project  role & responsibilities
            </label>
            <textarea
              id="project-role"
              placeholder="Describe your role in the project"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-features"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project key features & highlights
            </label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={`feature-${index}`} className="flex items-center gap-2">
                  <Input
                    ref={index === 0 ? firstFeatureInputRef : undefined}
                    id={index === 0 ? "project-features" : undefined}
                    placeholder={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) =>
                      setFeatures((prev) =>
                        prev.map((item, i) =>
                          i === index ? e.target.value : item,
                        ),
                      )
                    }
                    className={portfolioInputStyle}
                  />
                  {features.length > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0"
                      onClick={() =>
                        setFeatures((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShouldFocusNewFeature(true);
                  setFeatures((prev) => ["", ...prev]);
                }}
              >
                Add feature
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-challenges"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project challenges & solutions
            </label>
            <textarea
              id="project-challenges"
              placeholder="Describe the challenges faced and how they were solved"
              value={challengesAndSolutions}
              onChange={(e) => setChallengesAndSolutions(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-impact"
              className="block text-sm font-semibold text-zinc-900"
            >
             Project Impact and outcomes
            </label>
            <textarea
              id="project-impact"
              placeholder="Describe the impact and outcomes of the project"
              value={impactAndOutcomes}
              onChange={(e) => setImpactAndOutcomes(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-duration-breakdown"
              className="block text-sm font-semibold text-zinc-900"
            >
            Project Duration breakdown
            </label>
            <textarea
              id="project-duration-breakdown"
              placeholder={"Week 1: Research and Planning\nWeek 2: Design and Layout"}
              value={durationBreakdown}
              onChange={(e) => setDurationBreakdown(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="solution-url"
              className="block text-sm font-semibold text-zinc-900"
            >
              Solution URL{" "}
              <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Input
                id="solution-url"
                type="url"
                placeholder="Paste link"
                value={solutionUrl}
                onChange={(e) => setSolutionUrl(e.target.value)}
                className={cn(portfolioInputStyle, "pr-10")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <Link2 className="size-4" aria-hidden />
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="media-link"
              className="block text-sm font-semibold text-zinc-900"
            >
              Media URL{" "}
              <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Input
                id="media-link"
                type="url"
                placeholder="Paste link"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className={cn(portfolioInputStyle, "pr-10")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <Link2 className="size-4" aria-hidden />
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-900">
              Project files{" "}
              <span className="text-zinc-500 font-normal">(Max 6 files)</span>
            </label>
            {existingGalleryUrls.length > 0 && (
              <p className="text-xs text-zinc-500 mb-2">
                Current images (remove to drop from this draft; save sends new
                uploads only).
              </p>
            )}
            <input
              ref={projectFilesInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={onProjectFilesChange}
              className="hidden"
            />
            {mainGalleryItem ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 min-h-52">
                  {mainGalleryItem.isPdf ? (
                    <div className="flex h-full min-h-52 w-full flex-col items-center justify-center gap-3 bg-[#E8EFF1] px-6 text-center text-zinc-600">
                      <FileText className="size-12 text-primary" aria-hidden />
                      <span className="max-w-full truncate text-sm font-medium">
                        {mainGalleryItem.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => openPdfInNewTab(mainGalleryItem.src)}
                        className="text-xs font-medium text-primary underline underline-offset-2"
                      >
                        Click to read
                      </button>
                    </div>
                  ) : (
                    <img
                      src={mainGalleryItem.src}
                      alt=""
                      className="h-full max-h-50 w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={mainGalleryItem.remove}
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600"
                    aria-label={mainGalleryItem.removeLabel}
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
                <div className="flex justify-center flex-wrap gap-3">
                  {galleryItems.map((item) => (
                    <div
                      key={item.key}
                      className={cn(
                        "relative shrink-0 size-25 rounded-lg overflow-hidden bg-zinc-100 border transition-colors",
                        selectedGalleryKey === item.key
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-zinc-200 hover:border-zinc-300",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGalleryKey(item.key)}
                        className="h-full w-full"
                        aria-label="Preview image"
                      >
                        {item.isPdf ? (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#E8EFF1] px-2 text-zinc-600">
                            <FileText className="size-6 text-primary" aria-hidden />
                            <span className="w-full truncate text-[10px] font-medium">
                              {item.label}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                      {item.isPdf ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openPdfInNewTab(item.src);
                          }}
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-white/90 px-0.5 py-0.5 text-[9px] font-medium text-primary underline underline-offset-2"
                        >
                          Click to read
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          item.remove();
                        }}
                        className="absolute top-0.5 right-0.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                        aria-label={item.removeLabel}
                      >
                        <X className="size-3.5" aria-hidden />
                      </button>
                    </div>
                  ))}
                  {canAddMoreFiles ? (
                    <button
                      type="button"
                      onClick={() => projectFilesInputRef.current?.click()}
                      className={cn(
                        "shrink-0 size-25 rounded-lg border border-dashed border-zinc-300 bg-[#E8EFF1] flex flex-col items-center justify-center gap-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:border-zinc-400",
                      )}
                    >
                      <CameraIcon className="size-6" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => projectFilesInputRef.current?.click()}
                disabled={!canAddMoreFiles}
                className={cn(
                  "w-full rounded-lg bg-[#E8EFF1] min-h-30 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 transition-colors disabled:opacity-50 disabled:pointer-events-none",
                )}
              >
                <Cloud className="size-10" aria-hidden />
                <span className="text-sm font-medium">Add Project files</span>
                <span className="text-xs">
                  PNG, JPEG, GIF, WebP, PDF (max 5mb)
                </span>
              </button>
            )}
          </div>

          {errorMessage && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-primary text-white hover:bg-primary/90 h-11 rounded-lg font-medium mt-4"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

const FALLBACK_TOOLS = [
  "Figma",
  "Canva",
  "Sketch",
  "Jira",
  "Photoshop",
  "Adobe illustration",
  "Trello",
  "Light room",
];
const PROJECT_FORM_TOOLS_PER_PAGE = 12;
const TOOL_FILTER_CATEGORIES = [
  "all",
  "Project Management",
  "Data Analytics",
  "SOC Analyst",
  "Ethical Hacking",
  "Data Engineering",
  "GRC",
  "Business Analysis",
  "Data Science",
  "Product Design",
  "DevOps",
  "App/Cloud Security",
] as const;

const TOOL_CATEGORY_LOOKUP: Record<(typeof TOOL_FILTER_CATEGORIES)[number], Set<string>> = {
  all: new Set(),
  "Project Management": new Set([
    "slack",
    "microsoft excel",
    "confluence",
    "asana",
    "jira",
    "trello",
    "microsoft project",
    "google workspace",
    "microsoft office suite",
  ]),
  "Data Analytics": new Set([
    "sql",
    "microsoft excel",
    "power bi",
    "powerbi",
    "tableau",
    "looker studio",
    "mysql",
    "postgresql",
    "aws",
    "azure",
    "gcp",
    "databricks",
    "amazon athena",
    "amazon redshift",
  ]),
  "SOC Analyst": new Set([
    "misp",
    "wazuh",
    "splunk",
    "microsoft sentinel",
    "ubuntu",
    "qualys",
    "nessus",
    "kali linux",
  ]),
  "Ethical Hacking": new Set([
    "gophish",
    "bloodhound",
    "john the ripper",
    "netexec",
  ]),
  "Data Engineering": new Set([
    "apache airflow",
    "docker",
    "terraform",
    "microsoft azure",
    "google cloud platform (gcp)",
    "google cloud platform",
    "amazon web services (aws)",
    "amazon web services",
    "sql",
    "apache kafka",
    "python",
  ]),
  GRC: new Set([
    "servicenow platform",
    "vivantio",
    "nist cybersecurity framework (csf)",
    "iso 27001",
    "pci dss",
    "hipaa",
    "eramba",
    "gdpr framework",
    "service now grc",
    "jira service management",
    "power bi",
  ]),
  "Business Analysis": new Set([
    "salesforce",
    "power apps",
    "power automate",
    "figma",
    "draw.io",
    "monday.com",
    "mirror",
  ]),
  "Data Science": new Set([
    "postgresql / mysql",
    "apis (rest)",
    "aws s3 - data lake (raw + processed)",
    "snowflake / bigquery / redshift",
    "sql",
    "python",
    "pandas / numpy",
    "jupyter notebook",
    "matplotlib / seaborn",
    "scikit-learn",
    "xgboost / lightgbm",
    "pytorch",
    "mlflow",
    "model deployment",
    "fastapi",
    "docker containerization",
    "aws sagemaker",
    "apache airflow",
    "git + github",
    "github actions",
    "prometheus / cloudwatch",
  ]),
  "Product Design": new Set([
    "figma",
    "adobe xd",
    "sketch",
    "miro",
    "figjam",
    "notion",
    "maze",
    "usabilityhub",
    "zeplin",
    "design systems & style guides",
  ]),
  DevOps: new Set([
    "linux",
    "git & github",
    "docker",
    "kubernetes",
    "terraform",
    "ansible",
    "jenkins",
    "github actions",
    "aws",
    "azure",
    "google cloud platform (gcp)",
    "prometheus",
    "grafana",
    "nginx",
  ]),
  "App/Cloud Security": new Set([
    "sonarqube",
    "checkmarx",
    "owasp zap",
    "burp suite",
    "aws inspector",
    "prisma cloud",
    "aws",
    "azure",
    "gcp",
    "openscap",
    "falco",
  ]),
};

function getDisplayToolName(name: string): string {
  return name === "Adobe illustration" ? "Adobe Illustration" : name;
}

function AddProjectToolsSection({
  value,
  onChange,
  projectCategory,
}: {
  value: YourToolsData;
  onChange: (data: YourToolsData) => void;
  projectCategory: string;
}) {
  const [addToolsOpen, setAddToolsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: apiTools = [] } = useGetTools();

  const baseToolNames = useMemo(() => {
    const fromApi = apiTools
      .map((t) => t.name?.trim())
      .filter((n): n is string => !!n);
    return fromApi.length > 0 ? fromApi : FALLBACK_TOOLS;
  }, [apiTools]);

  const toolNameToIcon = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of apiTools) {
      const name = t.name?.trim();
      const icon = t.icon ?? t.url ?? t.image;
      if (name && icon) map[name] = getImageUrl(icon);
    }
    return map;
  }, [apiTools]);

  const displayedTools = [
    ...baseToolNames,
    ...value.selectedTools.filter((t) => !baseToolNames.includes(t)),
  ];
  const prioritizedTools = useMemo(() => {
    const normalizedCategory = projectCategory.trim().toLowerCase();
    const matchedCategory = TOOL_FILTER_CATEGORIES.find(
      (item) => item.toLowerCase() === normalizedCategory,
    );
    if (!matchedCategory || matchedCategory === "all") return displayedTools;
    const categorySet = TOOL_CATEGORY_LOOKUP[matchedCategory];
    const matchingTools: string[] = [];
    const otherTools: string[] = [];

    for (const name of displayedTools) {
      const normalizedName = name.trim().toLowerCase();
      if (categorySet.has(normalizedName)) {
        matchingTools.push(name);
      } else {
        otherTools.push(name);
      }
    }
    return [...matchingTools, ...otherTools];
  }, [displayedTools, projectCategory]);

  const filteredTools = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return prioritizedTools.filter((name) => {
      const normalizedName = name.trim().toLowerCase();
      const displayName = getDisplayToolName(name).toLowerCase();
      if (!query) return true;
      return normalizedName.includes(query) || displayName.includes(query);
    });
  }, [prioritizedTools, searchTerm]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTools.length / PROJECT_FORM_TOOLS_PER_PAGE),
  );
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * PROJECT_FORM_TOOLS_PER_PAGE;
    return filteredTools.slice(start, start + PROJECT_FORM_TOOLS_PER_PAGE);
  }, [currentPage, filteredTools]);
  const count = value.selectedTools.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, projectCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggle = (name: string) => {
    const isRemoving = value.selectedTools.includes(name);
    const next = isRemoving
      ? value.selectedTools.filter((t) => t !== name)
      : [...value.selectedTools, name];
    let nextCustomImages = value.customToolImages;
    if (isRemoving && value.customToolImages?.[name]) {
      const url = value.customToolImages[name];
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      nextCustomImages = { ...value.customToolImages };
      delete nextCustomImages[name];
      if (Object.keys(nextCustomImages).length === 0) nextCustomImages = undefined;
    }
    onChange({
      ...value,
      selectedTools: next,
      customToolImages: nextCustomImages,
    });
  };

  const handleAddDone = (toolName: string, imageFile: File | null) => {
    if (value.selectedTools.includes(toolName)) return;
    const nextSelected = [...value.selectedTools, toolName];
    const nextCustom: Record<string, string> = { ...value.customToolImages };
    if (imageFile) nextCustom[toolName] = URL.createObjectURL(imageFile);
    onChange({
      selectedTools: nextSelected,
      customToolImages: Object.keys(nextCustom).length ? nextCustom : undefined,
    });
    setAddToolsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{count} selected</span>
        <AddToolsPopoverLink
          open={addToolsOpen}
          onOpenChange={setAddToolsOpen}
          onDone={handleAddDone}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="project-tool-search"
          className="text-sm font-medium text-[#092A31]"
        >
          Search tools
        </label>
        <Input
          id="project-tool-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by tool name"
          className="border-zinc-200 bg-white"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {paginatedTools.map((name) => {
          const selected = value.selectedTools.includes(name);
          const displayName = getDisplayToolName(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm border transition-colors",
                "bg-[#E8EFF1] border-[#E8EFF1] text-[#2c4652]",
                "hover:bg-[#dce4e8] hover:border-[#dce4e8]",
                selected &&
                "bg-primary border-primary text-white hover:bg-primary hover:border-primary",
              )}
            >
              <ToolIcon
                name={name}
                customImageUrl={value.customToolImages?.[name]}
                apiImageUrl={toolNameToIcon[name]}
              />
              <span>{displayName}</span>
              {selected ? (
                <span className="flex size-4 shrink-0 items-center justify-center rounded bg-[#F7D25A]">
                  <Check className="size-3 text-primary" strokeWidth={3} />
                </span>
              ) : (
                <Square className="size-4 shrink-0 rounded-md text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>
      {filteredTools.length === 0 ? (
        <p className="text-sm text-zinc-500">No tools match your search.</p>
      ) : (
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-sm text-zinc-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-[#092A31] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-[#092A31] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddToolsPopoverLink({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: (toolName: string, imageFile: File | null) => void;
}) {
  return (
    <AddToolsPopover open={open} onOpenChange={onOpenChange} onDone={onDone}>
      <button
        type="button"
        className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
      >
        Add more
      </button>
    </AddToolsPopover>
  );
}
