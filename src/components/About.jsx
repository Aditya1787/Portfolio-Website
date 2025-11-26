import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[280px] w-full' tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.02} transitionSpeed={450}>
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.75)}
      className='w-full h-full'
    >
      <div className='bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl p-8 h-full flex flex-col items-center text-center hover:border-[#64ffda]/60 transition-all duration-300 group'>
        <div className='w-20 h-20 bg-black/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#64ffda]/20'>
          <img
            src={icon}
            alt={title}
            className='w-12 h-12 object-contain'
          />
        </div>

        <h3 className='text-white text-xl font-bold mb-4 group-hover:text-[#64ffda] transition-colors duration-300'>
          {title}
        </h3>
        
        <div className='w-12 h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <div id="about" className="relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#64ffda]/2 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-[#915EFF]/2 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <motion.div variants={textVariant()} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-3 bg-black/50 border border-[#64ffda] rounded-full text-[#64ffda] text-sm font-medium mb-4"
          >
            About Me
          </motion.div>
          <h2 className={`${styles.sectionHeadText} mb-6`}>
            Crafting Digital <span className="text-[#64ffda]">Excellence</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF] mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            variants={fadeIn("left", "tween", 0.2, 1)}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Passionate Developer & Problem Solver
            </h3>
            <p className='text-[#a8b2d1] text-lg leading-relaxed'>
              I'm a software developer with strong problem-solving skills and a solid foundation in data structures and algorithms. I specialize in building scalable and reliable applications using JavaScript, React, React Native, Node.js, and related technologies.
            </p>
            <p className='text-[#a8b2d1] text-lg leading-relaxed'>
              I enjoy tackling complex challenges, learning quickly, and working with clients to deliver solutions that are both efficient and user-friendly. My focus is on writing clean code, optimizing performance, and turning ideas into real products.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="px-4 py-2 bg-black/50 border border-[#64ffda]/50 rounded-full text-[#64ffda] text-sm">
                Problem Solving
              </div>
              <div className="px-4 py-2 bg-black/50 border border-[#64ffda]/50 rounded-full text-[#64ffda] text-sm">
                Clean Code
              </div>
              <div className="px-4 py-2 bg-black/50 border border-[#64ffda]/50 rounded-full text-[#64ffda] text-sm">
                Performance Optimization
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn("right", "tween", 0.2, 1)}
            className="relative"
          >
            <div className="w-full h-80 bg-black/50 rounded-2xl border border-[#64ffda]/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#64ffda] to-[#915EFF] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">R</span>
                </div>
                <p className="text-[#a8b2d1] text-lg">Full-Stack Developer</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            What I <span className="text-[#64ffda]">Specialize In</span>
          </h3>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");