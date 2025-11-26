import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ExperienceCard = ({ experience, index }) => {
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full"
    >
      <div className="flex items-center justify-center relative">
        {/* Timeline Dot */}

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
          viewport={{ once: true }}
          className={`w-full md:w-5/12 ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'} pl-6`}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl p-6 md:p-8 hover:border-[#64ffda]/60 transition-all duration-300 group relative">
            {/* Arrow pointing to timeline */}
            <div className={`hidden md:block absolute top-8 ${isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} w-0 h-0 border-t-[12px] border-b-[12px] ${isLeft ? 'border-l-[20px] border-l-[#64ffda]/30' : 'border-r-[20px] border-r-[#64ffda]/30'} border-t-transparent border-b-transparent`} />
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <h3 className="text-white text-2xl font-bold group-hover:text-[#64ffda] transition-colors duration-300">
                  {experience.title}
                </h3>
              </div>
              <div className="px-4 py-2 bg-black/50 border border-[#64ffda]/50 rounded-full self-start">
                <span className="text-[#64ffda] text-sm font-medium">
                  {experience.date}
                </span>
              </div>
            </div>

            <ul className="space-y-3">
              {experience.points.map((point, pointIndex) => (
                <motion.li
                  key={`experience-point-${pointIndex}`}
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.6 + pointIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="text-[#a8b2d1] text-sm leading-relaxed flex items-start gap-3"
                >
                  <div className="w-2 h-2 bg-[#64ffda] rounded-full mt-2 flex-shrink-0" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <div id="work" className="relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-40 right-10 w-40 h-40 bg-[#915EFF]/2 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-[#64ffda]/2 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <motion.div variants={textVariant()} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-3 bg-black/50 border border-[#64ffda] rounded-full text-[#64ffda] text-sm font-medium mb-4"
          >
            Journey
          </motion.div>
          <h2 className={`${styles.sectionHeadText} mb-6`}>
            Educational <span className="text-[#64ffda]">Background</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF] mx-auto rounded-full mb-8" />
        </motion.div>

        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-center mb-16"
        >
          <p className='text-[#a8b2d1] text-lg max-w-3xl mx-auto leading-relaxed'>
            My educational journey has been a continuous learning experience, building a strong foundation in computer science and developing the skills needed to create innovative solutions.
          </p>
        </motion.div>

        <div className="relative pl-8 md:pl-0">
          {/* Central Timeline Line - Full Height */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-[2px] md:w-1 h-full bg-gradient-to-b from-[#64ffda] to-[#915EFF] z-0" />
          
          <div className="space-y-16">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={`experience-${index}`}
                experience={experience}
                index={index}
              />
            ))}
          </div>
        </div>

        <motion.div
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl">
            <div className="w-3 h-3 bg-[#64ffda] rounded-full animate-pulse" />
            <span className="text-[#a8b2d1] text-sm">
              Continuously learning and growing in the field of technology
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Experience, "work");