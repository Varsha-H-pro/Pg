import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './HomePage/Navbar'

const About = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeInOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  const [open, setOpen] = useState(null);

  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <div className='about-page w-full bg-white text-black'>
      <Navbar />
      <motion.div
        className="about-hero relative h-96 overflow-hidden bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="hero-text absolute inset-0 flex flex-col justify-center items-center bg-white"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {/* Background Image */}
          <img src="/bg.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 opacity-85" />
          <motion.h1
            className="text-6xl font-bold z-10 text-white"
            variants={textVariants}
            custom={1}
          >
            About <span className='text-blue-600'>PG Perfect</span>
          </motion.h1>
          <motion.p
            className='text-xl italic font-semibold mt-4 z-10 text-white'
            variants={textVariants}
            custom={2}
          >
            Your Ultimate PG Management Solution
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="about-content container mx-auto px-10 py-16 bg-white">
        <motion.div
          className="content-section mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <h2 className='text-4xl font-bold mb-4 text-blue-600'>Who We Are</h2>
          <p className='text-lg text-black'>
            PG Perfect is dedicated to revolutionizing the way PGs are managed. Our comprehensive platform helps streamline operations, improve tenant satisfaction, and optimize management efficiency. With features like income and expense tracking, complaint management, and detailed reporting, we empower PG owners and managers to take control of their business.
          </p>
        </motion.div>

        <motion.div
          className="content-section mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <h2 className='text-4xl font-bold mb-4 text-blue-600'>Our Mission</h2>
          <p className='text-lg text-black'>
            Our mission is to provide a user-friendly and effective solution for PG management. We aim to simplify the daily tasks of PG owners and managers, allowing them to focus on providing the best living experience for their tenants.
          </p>
        </motion.div>

        <motion.div
          className="content-section mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <h2 className='text-4xl font-bold mb-4 text-blue-600'>Why Choose Us</h2>
          <ul className='list-disc list-inside space-y-2 text-black'>
            <li>Streamlined Operations: Manage all aspects of your PG with ease.</li>
            <li>Real-Time Insights: Get detailed reports and insights to make informed decisions.</li>
            <li>Tenant Satisfaction: Efficiently handle complaints and enhance tenant experience.</li>
            <li>Cost Control: Track income and expenses to optimize your budget.</li>
          </ul>
        </motion.div>

        <motion.div
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <h2 className='text-4xl font-bold mb-4 text-blue-600'>Get in Touch</h2>
          <p className='text-lg text-black'>
            Have questions or need support? Contact us at <a href="mailto:support@pgperfect.com" className='text-blue-600'>support@pgperfect.com</a> or call us at +1 234 567 890.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="faq-section my-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
        >
          <h2 className='text-4xl font-bold mb-8 text-blue-600'>Frequently Asked Questions</h2>
          <div className='space-y-4'>
            {[
              { question: 'What is PG Perfect?', answer: 'PG Perfect is a comprehensive platform designed to streamline the management of PG accommodations.' },
              { question: 'How does PG Perfect help PG owners?', answer: 'Our platform offers features like income and expense tracking, complaint management, and detailed reporting to help PG owners manage their properties efficiently.' },
              { question: 'Can tenants use PG Perfect?', answer: 'Yes, tenants can use PG Perfect to log complaints and communicate with the management easily.' },
              { question: 'How can I get support?', answer: 'You can contact us at support@pgperfect.com or call us at +1 234 567 890 for any support related queries.' }
            ].map((faq, index) => (
              <div key={index}>
                <button
                  className="w-full flex justify-between items-center text-left text-xl font-semibold py-2 px-4 bg-blue-600 text-white rounded-md"
                  onClick={() => handleToggle(index)}
                >
                  {faq.question}
                  <svg
                    className={`w-5 h-5 transform ${open === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {open === index && (
                  <div className="mt-2 text-lg text-black bg-gray-100 p-4 rounded-md">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Footer as Cards */}
      <div className="footer-cards container mx-auto px-10 py-16 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="footer-card p-6 bg-white shadow-md rounded-md">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">About Us</h3>
            <p className="text-lg text-black">PG Perfect is dedicated to revolutionizing the way PGs are managed, providing a comprehensive platform to streamline operations.</p>
          </div>
          <div className="footer-card p-6 bg-white shadow-md rounded-md">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Contact Information</h3>
            <p className="text-lg text-black">Email: <a href="mailto:support@pgperfect.com" className="text-blue-600">support@pgperfect.com</a></p>
            <p className="text-lg text-black">Phone: +1 234 567 890</p>
          </div>
          <div className="footer-card p-6 bg-white shadow-md rounded-md">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Legal</h3>
            <ul className="list-disc list-inside space-y-2 text-black">
              <li><a href="#" className="text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-600">Terms of Service</a></li>
              <li><a href="#" className="text-blue-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} PG Perfect. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <a href="#" className="hover:text-blue-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
