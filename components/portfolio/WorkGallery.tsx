"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Target, Award, Sparkles } from "lucide-react";
import { PortfolioProject } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface WorkGalleryProps {
  projects: PortfolioProject[];
}

const CATEGORIES = [
  "All",
  "Meta Ads",
  "Google Ads",
  "SEO",
  "Social Media",
  "Branding",
  "Concept Work",
];

export function WorkGallery({ projects }: WorkGalleryProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
  const [activeModalProject, setActiveModalProject] = React.useState<PortfolioProject | null>(null);

  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Concept Work") return project.projectType === "Concept Work";
    return project.category === selectedFilter;
  });

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        {CATEGORIES.map((cat) => {
          const isActive = selectedFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? "bg-[#6D28D9] text-white border-transparent shadow-md shadow-[#6D28D9]/20"
                  : "bg-white text-[#625A6D] border-[#E8E2EF] hover:border-[#D8B4FE] hover:text-[#17121F]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-xl hover:shadow-[#6D28D9]/5 transition-all duration-300 flex flex-col group"
          >
            {/* Project Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#17121F]">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Badge
                  variant={
                    project.projectType === "Concept Work"
                      ? "concept"
                      : project.projectType === "Agency Work"
                      ? "agency"
                      : "client"
                  }
                >
                  {project.projectType}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#A855F7] mb-2">
                  <span>{project.category}</span>
                  {project.industry && (
                    <>
                      <span>&bull;</span>
                      <span className="text-[#625A6D]">{project.industry}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#17121F] group-hover:text-[#6D28D9] transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm text-[#625A6D] leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Key Objectives Preview */}
                {project.objectives && (
                  <div className="mt-4 pt-4 border-t border-[#F5EFFF] space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A855F7] block">
                      Core Strategy:
                    </span>
                    {project.objectives.slice(0, 2).map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#17121F]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9] shrink-0 mt-0.5" />
                        <span className="text-[#625A6D]">{obj}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E2EF] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {project.services.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF9FC] text-[#625A6D] border border-[#E8E2EF]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] group/btn cursor-pointer py-1 px-2 rounded-lg hover:bg-[#F5EFFF]"
                >
                  <span>Full Blueprint</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blueprint Detail Modal */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setActiveModalProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8E2EF] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F5EFFF]">
              <Badge
                variant={
                  activeModalProject.projectType === "Concept Work" ? "concept" : "agency"
                }
              >
                {activeModalProject.projectType}
              </Badge>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="text-sm font-semibold text-[#625A6D] hover:text-[#17121F] px-2.5 py-1 rounded-full bg-[#FAF9FC] border border-[#E8E2EF]"
              >
                Close ✕
              </button>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
                {activeModalProject.category} &bull; {activeModalProject.industry}
              </span>
              <h3 className="text-2xl font-bold text-[#17121F] mt-1">
                {activeModalProject.title}
              </h3>
              <p className="mt-3 text-sm text-[#625A6D] leading-relaxed">
                {activeModalProject.description}
              </p>
            </div>

            {activeModalProject.objectives && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17121F]">
                  <Target className="w-4 h-4 text-[#6D28D9]" />
                  <span>Strategic Objectives</span>
                </div>
                <ul className="space-y-2">
                  {activeModalProject.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#625A6D]">
                      <CheckCircle2 className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeModalProject.outcomes && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#F5EFFF]/40 border border-[#E9D5FF]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                  <Sparkles className="w-4 h-4 text-[#6D28D9]" />
                  <span>Deliverables &amp; Outcomes</span>
                </div>
                <ul className="space-y-2">
                  {activeModalProject.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#17121F]">
                      <Award className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-[#F5EFFF] flex items-center justify-between">
              <Button
                href={`/contact?project=${encodeURIComponent(activeModalProject.title)}`}
                variant="primary"
                size="md"
              >
                Discuss Similar Strategy
              </Button>
              <span className="text-xs text-[#625A6D]">
                Connect &amp; Convert Framework
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
