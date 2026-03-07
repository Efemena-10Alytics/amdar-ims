"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cloud, Link2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { YourToolsData } from "@/components/_core/dashboard/portfolio/your-tools";
import { AddToolsPopover } from "@/components/_core/dashboard/portfolio/add-tools-popover";
import { portfolioInputStyle } from "@/components/_core/dashboard/portfolio/portfolio-styles";
import { cn } from "@/lib/utils";

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

export default function AddProjectPage() {
  const [toolsData, setToolsData] = useState<YourToolsData>({ selectedTools: [] });
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFilesInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const MAX_PROJECT_FILES = 6;
  const onProjectFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setProjectFiles((prev) => [...prev, ...files].slice(0, MAX_PROJECT_FILES));
    if (projectFilesInputRef.current) projectFilesInputRef.current.value = "";
  };
  const removeProjectFile = (index: number) => {
    setProjectFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddProject = () => {
    // TODO: submit to API
    router.push("/dashboard-dev/portfolio");
  };

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-zinc-200 bg-white py-4">
        <Link
          href="/dashboard-dev/portfolio"
          className="inline-flex items-center gap-2 text-sm text-[#76808D] hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
        <h1 className="text-lg font-semibold text-[#092A31] mt-2">Add Project</h1>
        <p className="text-sm text-[#A1A8B1] mt-1">
          Add one of your best project here
        </p>
      </header>

      <div className="flex-1 py-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-12">
        {/* Left: Your Tools */}
        <div className="rounded-xl h-fit bg-[#F8FAFC] p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Your Tools</h2>
          <p className="text-sm text-zinc-500 mt-1 mb-4">
            Select the tools you used in this project
          </p>
          <AddProjectToolsSection value={toolsData} onChange={setToolsData} />
        </div>

        {/* Right: Project details */}
        <div className="space-y-6">
          {/* Upload cover image */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Cover image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={onCoverChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full rounded-lg border-primary/40 bg-[#B6CFD4] min-h-45 flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/10 transition-colors",
                coverPreview && "relative overflow-hidden"
              )}
            >
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
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
                  <span className="text-xs text-zinc-500">Jpeg (max 5mb)</span>
                </>
              )}
            </button>
            {coverPreview && (
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
              <label htmlFor="project-title" className="block text-sm font-semibold text-zinc-900">
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
              <label htmlFor="project-category" className="block text-sm font-semibold text-zinc-900">
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
            <label htmlFor="project-overview" className="block text-sm font-semibold text-zinc-900">
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
            <label htmlFor="project-rationale" className="block text-sm font-semibold text-zinc-900">
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
            <label htmlFor="project-aim" className="block text-sm font-semibold text-zinc-900">
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
            <label htmlFor="project-scope" className="block text-sm font-semibold text-zinc-900">
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
            <label htmlFor="project-expert" className="block text-sm font-semibold text-zinc-900">
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
            <label htmlFor="solution-url" className="block text-sm font-semibold text-zinc-900">
              Solution URL <span className="text-zinc-500 font-normal">(Optional)</span>
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
            <label htmlFor="media-link" className="block text-sm font-semibold text-zinc-900">
              Media link <span className="text-zinc-500 font-normal">(Optional)</span>
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
              Project image <span className="text-zinc-500 font-normal">(Max 6 files)</span>
            </label>
            <input
              ref={projectFilesInputRef}
              type="file"
              accept=".doc,.docx,application/pdf,image/jpeg,image/jpg"
              multiple
              onChange={onProjectFilesChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => projectFilesInputRef.current?.click()}
              disabled={projectFiles.length >= MAX_PROJECT_FILES}
              className={cn(
                "w-full rounded-lg bg-[#E8EFF1] min-h-30 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              <Cloud className="size-10" aria-hidden />
              <span className="text-sm font-medium">Add Project files</span>
              <span className="text-xs">Doc, PDF Jpeg (max 5mb)</span>
            </button>
            {projectFiles.length > 0 && (
              <ul className="mt-2 space-y-1">
                {projectFiles.map((file, i) => (
                  <li key={i} className="flex items-center justify-between text-sm text-zinc-600">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeProjectFile(i)}
                      className="text-zinc-400 hover:text-red-600 shrink-0 ml-2"
                    >
                      <Trash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            type="button"
            onClick={handleAddProject}
            className="w-full bg-primary text-white hover:bg-primary/90 h-11 rounded-lg font-medium mt-4"
          >
            Add project
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddProjectToolsSection({
  value,
  onChange,
}: {
  value: YourToolsData;
  onChange: (data: YourToolsData) => void;
}) {
  const [addToolsOpen, setAddToolsOpen] = useState(false);
  const TOOLS = [
    "Figma",
    "Canva",
    "Sketch",
    "Jira",
    "Photoshop",
    "Adobe illustration",
    "Trello",
    "Light room",
  ];
  const displayedTools = [...TOOLS, ...value.selectedTools.filter((t) => !TOOLS.includes(t))];
  const count = value.selectedTools.length;

  const toggle = (name: string) => {
    const next = value.selectedTools.includes(name)
      ? value.selectedTools.filter((t) => t !== name)
      : [...value.selectedTools, name];
    onChange({ ...value, selectedTools: next });
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
          const iconSrc = value.customToolImages?.[name] ?? TOOL_IMAGES[name];
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm border transition-colors",
                "bg-primary/10 border-primary/20 text-[#092A31]",
                "hover:bg-primary/15",
                selected && "bg-primary border-primary text-white hover:bg-primary"
              )}
            >
              {iconSrc ? (
                <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img src={iconSrc} alt="" className="size-4 object-contain" />
                </span>
              ) : (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600">
                  {name.charAt(0)}
                </span>
              )}
              <span>{name === "Adobe illustration" ? "Adobe Illustration" : name}</span>
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
