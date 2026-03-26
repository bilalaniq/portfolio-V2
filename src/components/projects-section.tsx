import { useState } from "react";
import StackingCards, { StackingCardItem } from "./ui/stacking-cards";
import {
  GitHubProfile,
  ProjectCardsData,
  ProjectsSectionHeading,
  ProjectsSectionSubHeading,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./max-width-wrapper";
import { GithubProjectsBtn } from "./ui/github-projects-btn";
import { VisitLiveSiteBtn } from "./ui/visit-live-site-btn";
import { GithubIconBtn } from "./ui/github-icon-btn";
import { Link } from "react-router";
import { motion } from "motion/react";

const ProjectsSection = () => {
  // @ts-ignore
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div id="Work" className="z-[2]">
      <MaxWidthWrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative z-[3] pt-32 items-center justify-center flex flex-col pb-32"
        >
          <div className="relative font-myMainFont w-full text-4xl md:text-6xl font-semibold flex justify-center items-center text-myPalette9">
            {ProjectsSectionHeading}
          </div>
          <p className="text-myPalette9 text-base md:text-lg font-medium text-center font-myMainFont mt-3">
            {ProjectsSectionSubHeading}
          </p>
          <Link target="_blank" to={GitHubProfile}>
            <GithubProjectsBtn />
          </Link>
        </motion.div>

        <div className="relative z-[2] -mt-52 mb-6">
          <StackingCards
            totalCards={ProjectCardsData.length}
            scrollOptons={{ container: { current: container } }}
          >
            {ProjectCardsData.map((project, index) => (
              <StackingCardItem
                key={index}
                index={index}
                className="h-[500px] sm:h-[480px] md:h-[460px] lg:h-[440px]"
              >
                <div className={cn(
                  "absolute inset-2 md:inset-3",
                  "bg-white rounded-[20px] border border-myPalette2",
                  "shadow-sm overflow-hidden",
                  "flex flex-col lg:flex-row pointer-events-auto"
                )}>

                  {/* ── LEFT: text panel ── */}
                  <div className="flex-1 flex flex-col p-7 md:p-8 min-w-0">

                    {/* type · year */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-myPalette5">
                        {project.type}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-myPalette4 inline-block" />
                      <span className="text-[11px] font-semibold text-myPalette5">
                        {project.year}
                      </span>
                    </div>

                    {/* title */}
                    <h3 className="font-semibold text-2xl md:text-[28px] leading-tight text-myPalette9 mb-3 tracking-tight">
                      {project.title}
                    </h3>

                    {/* short accent bar */}
                    <div className="w-8 h-[2px] bg-myPalette9 rounded-full mb-4" />

                    {/* description */}
                    <p className="text-sm md:text-[15px] text-myPalette6 leading-relaxed line-clamp-4 mb-auto">
                      {project.description}
                    </p>

                    {/* tech tags */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {project.technologies.map((techstack, techIndex) => (
                        <div
                          key={techIndex}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-myPalette3 text-[11px] text-myPalette6"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                project.techColors[techIndex % project.techColors.length],
                            }}
                          />
                          {techstack}
                        </div>
                      ))}
                    </div>

                    {/* buttons */}
                    <div className="flex gap-2 mt-5">
                      {project.projectUrl && (
                        <Link target="_blank" to={project.projectUrl}>
                          <VisitLiveSiteBtn />
                        </Link>
                      )}
                      {project.githubUrl && (
                        <Link target="_blank" to={project.githubUrl}>
                          <GithubIconBtn />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* ── RIGHT: image panel ── */}
                  <div className="
                    w-full h-48
                    lg:w-[44%] lg:h-auto
                    flex-shrink-0
                    bg-myPalette1
                    border-t border-myPalette2
                    lg:border-t-0 lg:border-l
                    relative
                    flex items-center justify-center
                    p-6
                  ">
                    {/* subtle dot grid */}
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `radial-gradient(circle, #212529 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain rounded-xl"
                    />
                  </div>

                </div>
              </StackingCardItem>
            ))}
          </StackingCards>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default ProjectsSection;