import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.2, 0.75)}>
      <Tilt
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        scale={1.02}
        transitionSpeed={450}
        className='w-full'
      >
        <div 
          className='bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl overflow-hidden hover:border-[#64ffda]/60 transition-all duration-300 group'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='relative w-full h-[250px] overflow-hidden'>
            <img
              src={image}
              alt='project_image'
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            />

            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(source_code_link, "_blank")}
                className='bg-gradient-to-r from-[#64ffda] to-[#915EFF] w-14 h-14 rounded-full flex justify-center items-center cursor-pointer shadow-lg hover:shadow-[#64ffda]/25'
              >
                <img
                  src={github}
                  alt='source code'
                  className='w-6 h-6 object-contain filter brightness-0 invert'
                />
              </motion.div>
            </div>
          </div>

          <div className='p-6'>
            <h3 className='text-white font-bold text-xl mb-3 group-hover:text-[#64ffda] transition-colors duration-300'>
              {name}
            </h3>
            <p className='text-[#a8b2d1] text-sm leading-relaxed mb-4'>
              {description}
            </p>

            <div className='flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <span
                  key={`${name}-${tag.name}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tag.color === 'blue-text-gradient' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : tag.color === 'green-text-gradient'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <div id="works" className="relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-40 left-10 w-40 h-40 bg-[#915EFF]/2 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-32 h-32 bg-[#64ffda]/2 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <motion.div variants={textVariant()} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-3 bg-black/50 border border-[#64ffda] rounded-full text-[#64ffda] text-sm font-medium mb-4"
          >
            Portfolio
          </motion.div>
          <h2 className={`${styles.sectionHeadText} mb-6`}>
            Featured <span className="text-[#64ffda]">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF] mx-auto rounded-full mb-8" />
        </motion.div>

        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-center mb-16"
        >
          <p className='text-[#a8b2d1] text-lg max-w-4xl mx-auto leading-relaxed'>
            The following projects highlight my skills and hands-on experience through practical examples of my work. Each project includes a short description along with links to the code repositories and live demos. They demonstrate my problem-solving abilities, proficiency with various technologies, and effective project management skills.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} index={index} {...project} />
          ))}
        </div>

        <motion.div
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-[#64ffda] to-[#915EFF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#64ffda]/25 transition-all duration-300"
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "");