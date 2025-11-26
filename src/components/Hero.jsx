import { motion } from "framer-motion";

import { styles } from "../styles";

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto overflow-hidden`}>
      {/* Subtle background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-[#64ffda] rotate-45 opacity-10" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-[#64ffda] rounded-full opacity-5" />
      <div className="absolute bottom-40 left-1/4 w-12 h-12 border border-[#64ffda] opacity-10" />
      
      <div
        className={`relative z-10 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-col lg:flex-row items-center justify-between gap-10`}
      >
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-black/50 border border-[#64ffda] rounded-full text-[#64ffda] text-sm font-medium">
              Welcome to my digital space
            </div>
            
            <h1 className={`${styles.heroHeadText} text-white leading-tight`}>
              Hi, I'm <span className='text-[#64ffda] relative'>
                Raj
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            
            <p className={`${styles.heroSubText} max-w-2xl`}>
              A passionate <span className="text-[#64ffda] font-semibold">Full-Stack Developer</span> crafting 
              digital experiences through innovative web applications and robust backend solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const worksSection = document.getElementById('works');
                  if (worksSection) {
                    worksSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-[#64ffda] to-[#915EFF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#64ffda]/25 transition-all duration-300"
              >
                View My Work
              </motion.button>
              <a href="https://drive.usercontent.google.com/u/0/uc?id=1pYU1o4wZrLvKa4HGxvHfKiEAZJTXbX9E&export=download" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-[#64ffda] text-[#64ffda] font-semibold rounded-lg hover:bg-[#64ffda] hover:text-slate-900 transition-all duration-300"
                >
                  Download CV
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right side - Visual element */}
        <div className="flex-1 lg:max-w-lg flex items-center justify-center">
          <div className="w-80 h-80 bg-gradient-to-br from-[#64ffda]/10 to-[#915EFF]/10 rounded-full flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-[#64ffda]/20 to-[#915EFF]/20 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-[#64ffda]/30 to-[#915EFF]/30 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold text-white">R</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className='w-[35px] h-[64px] rounded-3xl border-2 border-[#64ffda] flex justify-center items-start p-2 hover:border-[#915EFF] transition-colors duration-300'
          >
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-[#64ffda] mb-1'
            />
          </motion.div>
        </a>
      </div>
    </section>
  );
};

export default Hero;