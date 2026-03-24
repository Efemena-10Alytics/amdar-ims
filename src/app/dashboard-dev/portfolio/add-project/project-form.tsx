"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type FormEvent,
} from "react";
import Link from "next/link";
import { ArrowLeft, Check, Cloud, Link2, Square, X } from "lucide-react";
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
  const [overview, setOverview] = useState("");
  const [rationale, setRationale] = useState("");
  const [aim, setAim] = useState("");
  const [scope, setScope] = useState("");
  const [expert, setExpert] = useState("");
  const [solutionUrl, setSolutionUrl] = useState("");
  const [mediaLink, setMediaLink] = useState("");
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [remoteCoverUrl, setRemoteCoverUrl] = useState<string | null>(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFilesInputRef = useRef<HTMLInputElement>(null);
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
    setOverview(initialProject.overview?.trim() ?? "");
    setRationale(initialProject.rationale?.trim() ?? "");
    setAim(initialProject.aim?.trim() ?? "");
    setScope(initialProject.scope?.trim() ?? "");
    setExpert(initialProject.excerpt?.trim() ?? "");
    setSolutionUrl(initialProject.solutionUrl?.trim() ?? "");
    setMediaLink(initialProject.mediaLink?.trim() ?? "");

    const names: string[] = [];
    const custom: Record<string, string> = {};
    for (const t of initialProject.tools ?? []) {
      const n = t.name?.trim();
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
    const gallery = (initialProject.image ?? [])
      .map((u) => getImageUrl(u))
      .filter((u): u is string => !!u);
    setExistingGalleryUrls(gallery);
  }, [initialProject, prefillKey]);

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
    const room = MAX_PROJECT_FILES - existingGalleryUrls.length - projectFiles.length;
    if (room <= 0) return;
    setProjectFiles((prev) => [...prev, ...files].slice(0, room));
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      overview,
      rationale,
      aim,
      scope,
      expert,
      solutionUrl,
      mediaLink,
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
    <div className="min-h-full flex flex-col">
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
          <AddProjectToolsSection value={toolsData} onChange={setToolsData} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              htmlFor="project-rationale"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project rationale
            </label>
            <textarea
              id="project-rationale"
              placeholder="Explain what you did during this project"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-aim"
              className="block text-sm font-semibold text-zinc-900"
            >
              Aim of project
            </label>
            <textarea
              id="project-aim"
              placeholder="Explain what you did during this project"
              value={aim}
              onChange={(e) => setAim(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-scope"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project scope
            </label>
            <textarea
              id="project-scope"
              placeholder="Explain what you did during this project"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              rows={4}
              className={cn(portfolioInputStyle, "min-h-25 resize-y")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-expert"
              className="block text-sm font-semibold text-zinc-900"
            >
              Project expert
            </label>
            <textarea
              id="project-expert"
              placeholder="Explain what you did during this project"
              value={expert}
              onChange={(e) => setExpert(e.target.value)}
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
              Media link{" "}
              <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Input
                id="media-link"
                type="url"
                placeholder="Paste link"
                value={mediaLink}
                onChange={(e) => setMediaLink(e.target.value)}
                className={cn(portfolioInputStyle, "pr-10")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                <Link2 className="size-4" aria-hidden />
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-900">
              Project image{" "}
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
              accept="image/*"
              multiple
              onChange={onProjectFilesChange}
              className="hidden"
            />
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
              <span className="text-xs">PNG, JPEG, GIF, WebP (max 5mb)</span>
            </button>
            {(existingGalleryUrls.length > 0 || projectFiles.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-3">
                {existingGalleryUrls.map((url, i) => (
                  <div
                    key={`ex-${i}`}
                    className="relative shrink-0 size-25 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(i)}
                      className="absolute top-0.5 right-0.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                      aria-label="Remove image from list"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </div>
                ))}
                {projectFiles.map((file, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative shrink-0 size-25 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200"
                  >
                    {projectPreviews[i] && (
                      <img
                        src={projectPreviews[i]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeProjectFile(i)}
                      className="absolute top-0.5 right-0.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMessage && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
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

function AddProjectToolsSection({
  value,
  onChange,
}: {
  value: YourToolsData;
  onChange: (data: YourToolsData) => void;
}) {
  const [addToolsOpen, setAddToolsOpen] = useState(false);
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
  const count = value.selectedTools.length;

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
      <div className="flex flex-wrap gap-2">
        {displayedTools.map((name) => {
          const selected = value.selectedTools.includes(name);
          const displayName =
            name === "Adobe illustration" ? "Adobe Illustration" : name;
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
