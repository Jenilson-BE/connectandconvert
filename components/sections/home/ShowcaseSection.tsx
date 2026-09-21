import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ShowcaseSection() {
  const featured = PORTFOLIO_PROJECTS.slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-[#FAF9FC] relative" id="work">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            eyebrow="CREATIVE PORTFOLIO"
            title="Ideas built to make an impression."
            subtitle="Explore selected creative concepts, marketing projects, and visual explorations from Connect & Convert. Transparently labeled by project type."
          />
          <Button href="/work" variant="secondary" size="md">
            View All Work ({PORTFOLIO_PROJECTS.length})
          </Button>
        </div>

        {/* Editorial Grid / Masonry-style rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-xl hover:shadow-[#6D28D9]/5 transition-all duration-300 flex flex-col group"
            >
              {/* Project Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#17121F]">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 z-10">
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

              {/* Project Info */}
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

                  <p className="mt-3 text-sm text-[#625A6D] leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F5EFFF] flex items-center justify-between">
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

                  <Link
                    href="/work"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] group/link"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
