import React from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const Tech = () => {
  return (
    <div id="tech" className="relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-[#64ffda]/2 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-[#915EFF]/2 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <motion.div variants={textVariant()} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-3 bg-black/50 border border-[#64ffda] rounded-full text-[#64ffda] text-sm font-medium mb-4"
          >
            Skills & Technologies
          </motion.div>
          <h2 className={`${styles.sectionHeadText} mb-6`}>
            Tech <span className="text-[#64ffda]">Stack</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF] mx-auto rounded-full mb-8" />
        </motion.div>

        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-center mb-16"
        >
          <p className='text-[#a8b2d1] text-lg max-w-3xl mx-auto leading-relaxed'>
            I work with a wide range of technologies and tools to create modern, scalable, and efficient applications. Here are some of the key technologies I use in my projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 justify-items-center">
          {technologies.map((technology, index) => (
            <motion.div
              key={technology.name}
              variants={fadeIn("up", "spring", index * 0.1, 0.75)}
              className="group"
            >
              <div className="w-24 h-24 relative">
                <BallCanvas icon={technology.icon} />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[#64ffda] text-sm font-medium whitespace-nowrap">
                    {technology.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl">
            <div className="w-3 h-3 bg-[#64ffda] rounded-full animate-pulse" />
            <span className="text-[#a8b2d1] text-sm">
              Always learning and exploring new technologies
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "");