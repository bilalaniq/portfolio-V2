import GitHubCalendar from 'react-github-calendar';
import MaxWidthWrapper from './max-width-wrapper';
import { motion } from "motion/react";
import {
  AboutSectionHeading,
  AboutSectionSkillsHeading,
  AboutSectionSubHeading,
  AboutMeHeading,
  AboutMeBio,
  AboutMeLocation,
  AboutMeStatus,
  AboutMeUniversity,
  GithubIcon,
  GitHubProfile,
  InstagramIcon,
  InstagramProfile,
  LinkedInIcon,
  LinkedInProfile,
  MediumIcon,
  MediumProfile,
  SkillsData1,
  SkillsData2,
  profilePhoto,
  HeroSectionHeading,
} from '@/lib/constants';
import Marquee from "react-fast-marquee";
import {
  MouseTrackerProvider as CursorProvider,
  Pointer as Cursor,
  PointerFollower as CursorFollow,
} from "@/components/ui/cursor";
import { MousePointer2, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const AboutSection = () => {
  return (
    <div>
      <MaxWidthWrapper>
        <div className='pt-48 md:pt-52 pb-10 lg:mx-16'>

          {/* ── Section heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="relative font-myMainFont w-full text-4xl md:text-6xl font-semibold flex justify-center items-center text-myPalette9">
              {AboutSectionHeading}
            </div>
            <p className="text-myPalette9 text-base md:text-lg font-medium text-center font-myMainFont mt-3">
              {AboutSectionSubHeading}
            </p>
          </motion.div>

          {/* ── ABOUT ME BLOCK ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-6 mb-6"
          >
            {/* Photo card */}
            <div className="lg:w-[30%] bg-white border border-myPalette2 shadow-lg rounded-3xl overflow-hidden flex-shrink-0">
              <div className="relative w-full aspect-square overflow-hidden">
                <img
                  src={profilePhoto}
                  alt="bilalaniq"
                  className="w-full h-full object-cover object-top"
                />
                {/* subtle gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
              </div>
              {/* name + role under photo */}
              <div className="px-4 md:px-6 pb-6 pt-3">
                <h3 className="font-semibold text-xl text-myPalette9 font-myMainFont">
                  bilalaniq
                </h3>
                <p className="text-sm text-myPalette5 font-myMainFont mt-0.5">
                  {HeroSectionHeading}
                </p>
              </div>
            </div>

            {/* Bio card */}
            <div className="flex-1 bg-white border border-myPalette2 shadow-lg rounded-3xl p-7 md:p-9 flex flex-col justify-between gap-6">

              {/* heading + bio */}
              <div>
                <h2 className="font-semibold text-3xl md:text-4xl text-myPalette9 font-myMainFont leading-tight mb-4">
                  {AboutMeHeading}
                </h2>
                <div className="w-10 h-[2px] bg-myPalette8 rounded-full mb-5" />
                <p className="text-myPalette6 text-base md:text-lg leading-relaxed font-myMainFont">
                  {AboutMeBio}
                </p>
              </div>

              {/* info pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-myPalette2 bg-myPalette1 text-sm text-myPalette7 font-myMainFont">
                  <MapPin size={14} className="text-myPalette5" />
                  {AboutMeLocation}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-myPalette2 bg-myPalette1 text-sm text-myPalette7 font-myMainFont">
                  <GraduationCap size={14} className="text-myPalette5" />
                  {AboutMeUniversity}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-myPalette2 bg-myPalette1 text-sm text-myPalette7 font-myMainFont">
                  <Briefcase size={14} className="text-myPalette5" />
                  {AboutMeStatus}
                </div>
              </div>

            </div>
          </motion.div>

          {/* ── SOCIAL + SKILLS ROW ── */}
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='md:w-[40%] bg-white border border-myPalette2 shadow-lg rounded-3xl px-6 pt-6 pb-6 grid grid-cols-2 gap-4'>
              <a href={LinkedInProfile} target='_blank' className='bg-white border border-myPalette2 shadow-md rounded-xl p-2 justify-center items-center flex cursor-none'>
                <img className="h-14 aspect-square" src={LinkedInIcon} alt="LinkedIn" />
                <CursorProvider>
                  <Cursor>
                    <MousePointer2 className="fill-blue-500 stroke-blue-600" size={30} />
                  </Cursor>
                  <CursorFollow align="bottom-right">
                    <div className="bg-blue-500 text-white border border-white/10 text-xs px-2 py-1 rounded-md shadow-md w-[105px]">
                      bilalaniq
                    </div>
                  </CursorFollow>
                </CursorProvider>
              </a>
              <a href={GitHubProfile} target='_blank' className='bg-white border border-myPalette2 shadow-md rounded-xl p-2 justify-center items-center flex cursor-none'>
                <img className="h-14 aspect-square" src={GithubIcon} alt="GitHub" />
                <CursorProvider>
                  <Cursor>
                    <MousePointer2 className="fill-myPalette1 stroke-myPalette9" size={30} />
                  </Cursor>
                  <CursorFollow align="bottom-right">
                    <div className="bg-myPalette9 text-myPalette1 border border-white/10 text-xs px-2 py-1 rounded-md shadow-md w-[105px]">
                      bilalaniq
                    </div>
                  </CursorFollow>
                </CursorProvider>
              </a>
              <a href={MediumProfile} target='_blank' className='bg-white border border-myPalette2 shadow-md rounded-xl p-2 justify-center items-center flex cursor-none'>
                <img className="h-14 aspect-square" src={MediumIcon} alt="Medium" />
                <CursorProvider>
                  <Cursor>
                    <MousePointer2 className="fill-myPalette1 stroke-myPalette9" size={30} />
                  </Cursor>
                  <CursorFollow align="bottom-right">
                    <div className="bg-myPalette9 text-myPalette1 border border-white/10 text-xs px-2 py-1 rounded-md shadow-md w-[110px]">
                      @bilalaniq
                    </div>
                  </CursorFollow>
                </CursorProvider>
              </a>
              <a href={InstagramProfile} target='_blank' className='bg-white border border-myPalette2 shadow-md rounded-xl p-2 justify-center items-center flex cursor-none'>
                <img className="h-14 aspect-square" src={InstagramIcon} alt="Instagram" />
                <CursorProvider>
                  <Cursor>
                    <MousePointer2 className="fill-red-500 stroke-red-600" size={30} />
                  </Cursor>
                  <CursorFollow align="bottom-right">
                    <div className="bg-red-500 text-white border border-white/10 text-xs px-2 py-1 rounded-md shadow-md w-[120px]">
                      @bilalaniq
                    </div>
                  </CursorFollow>
                </CursorProvider>
              </a>
            </div>

            <div className='md:w-[60%] bg-white border border-myPalette2 shadow-lg rounded-3xl px-6 pt-6 pb-2'>
              <h3 className="font-semibold text-xl md:text-2xl">
                {AboutSectionSkillsHeading}
              </h3>
              <div className='mt-6'>
                <Marquee autoFill gradient gradientWidth={40}>
                  {SkillsData1.map((item, i) => (
                    <div key={i} className='bg-white border border-myPalette2 shadow-lg rounded-xl mr-2 mb-4 p-2 flex flex-row items-center gap-2'>
                      <img className="h-10 aspect-square" src={item.icon} alt={item.name} />
                      <p className='font-myMainFont font-semibold text-lg'>{item.name}</p>
                    </div>
                  ))}
                </Marquee>
                <Marquee autoFill direction="right" gradient gradientWidth={40}>
                  {SkillsData2.map((item, i) => (
                    <div key={i} className='bg-white border border-myPalette2 shadow-lg rounded-xl mr-2 mb-6 p-2 flex flex-row items-center gap-2'>
                      <img className="h-10 aspect-square" src={item.icon} alt={item.name} />
                      <p className='font-myMainFont font-semibold text-lg'>{item.name}</p>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>

          {/* ── GITHUB CALENDAR ── */}
          <div className='hidden lg:flex bg-white border border-myPalette2 shadow-lg p-6 items-center justify-center rounded-3xl mt-6'>
            <GitHubCalendar
             username="bilalaniq"
             showWeekdayLabels
             errorMessage='GitHub Contribution Data not found'
             colorScheme='light'
           />
          </div>

        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default AboutSection;