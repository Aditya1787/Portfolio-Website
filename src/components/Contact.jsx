import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn, fadeIn, textVariant } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div id="contact" className="relative overflow-x-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#64ffda]/2 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#915EFF]/2 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <motion.div variants={textVariant()} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-3 bg-black/50 border border-[#64ffda] rounded-full text-[#64ffda] text-sm font-medium mb-4"
          >
            Get In Touch
          </motion.div>
          <h2 className={`${styles.sectionHeadText} mb-6`}>
            Let's <span className="text-[#64ffda]">Connect</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#64ffda] to-[#915EFF] mx-auto rounded-full mb-8" />
        </motion.div>

        <motion.div
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-center mb-10 md:mb-16"
        >
          <p className='text-[#a8b2d1] text-lg max-w-3xl mx-auto leading-relaxed'>
            Have a project in mind or want to discuss opportunities? I'd love to hear from you. Let's create something amazing together!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start w-full max-w-full overflow-x-hidden">
          {/* Contact Form */}
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="min-w-0 bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl p-6 md:p-8 hover:border-[#64ffda]/60 transition-all duration-300 w-full"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">Send me a message</h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className='flex flex-col gap-6'
            >
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <label className='flex flex-col'>
                  <span className='text-white font-medium mb-3'>Your Name</span>
                  <input
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your name?"
                    className='bg-black/50 border border-[#64ffda]/50 py-3 md:py-4 px-4 md:px-6 placeholder:text-[#a8b2d1] text-white rounded-lg outline-none font-medium focus:border-[#64ffda] transition-colors duration-300'
                  />
                </label>
                <label className='flex flex-col'>
                  <span className='text-white font-medium mb-3'>Your Email</span>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className='bg-black/50 border border-[#64ffda]/50 py-3 md:py-4 px-4 md:px-6 placeholder:text-[#a8b2d1] text-white rounded-lg outline-none font-medium focus:border-[#64ffda] transition-colors duration-300'
                  />
                </label>
              </div>
              
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-3'>Your Message</span>
                <textarea
                  rows={6}
                  name='message'
                  value={form.message}
                  onChange={handleChange}
                  placeholder='Tell me about your project or just say hello!'
                  className='bg-slate-800/50 border border-[#64ffda]/30 py-3 md:py-4 px-4 md:px-6 placeholder:text-[#a8b2d1] text-white rounded-lg outline-none font-medium focus:border-[#64ffda] transition-colors duration-300 resize-none'
                />
              </label>

              <motion.button
                type='submit'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-[#64ffda] to-[#915EFF] py-3 md:py-4 px-6 md:px-8 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-[#64ffda]/25 transition-all duration-300 self-start'
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & 3D Canvas */}
          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className="min-w-0 space-y-8 w-full"
          >
            {/* Contact Information */}
            <div className="bg-black/50 backdrop-blur-sm border border-[#64ffda]/30 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Let's talk</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#64ffda] to-[#915EFF] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📧</span>
                  </div>
                  <div>
                    <p className="text-[#a8b2d1] text-sm">Email</p>
                    <p className="text-white font-medium">raj85singh95@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#64ffda] to-[#915EFF] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">💼</span>
                  </div>
                  <div>
                    <p className="text-[#a8b2d1] text-sm">LinkedIn</p>
                    <p className="text-white font-medium">linkedin.com/in/raj-singh-a1a819283</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#64ffda] to-[#915EFF] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🐙</span>
                  </div>
                  <div>
                    <p className="text-[#a8b2d1] text-sm">GitHub</p>
                    <p className="text-white font-medium">github.com/rajsingh73</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="h-[260px] md:h-[400px] rounded-2xl overflow-hidden border border-[#64ffda]/20 w-full max-w-full">
              <EarthCanvas />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");