"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Menu,
  X as CloseIcon,
  ChevronDown,
  Mail,
  Phone,
  Linkedin,
  User,
  Lock,
} from "lucide-react";
import { SparklesCore } from "./Sparkle.js";
import axios from "axios";
import Analysis from "./Analysis.js";

// New component for the opening animation
const OpeningAnimation = ({ onAnimationComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3 }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.img
        src="kanini.png"
        alt="Kanini Logo"
        className="w-24 h-24"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.h1
        className="text-4xl font-extrabold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        K-INSURE
      </motion.h1>
    </motion.div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [focusedImage, setFocusedImage] = useState(null);
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);

  // navigation
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const analysisRef = useRef(null);
  const contactRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const imageRotation = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // components in navbar
  const menuItems = useMemo(
    () => [
      { name: "home", ref: heroRef },
      { name: "about", ref: aboutRef },
      { name: "analysis", ref: analysisRef },
      { name: "contact", ref: contactRef },
    ],
    []
  );

  const scrollToSection = (elementRef, section) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
    }
    setIsMenuOpen(false);
  };

  const navigateToSection = (section) => {
    const sectionItem = menuItems.find((item) => item.name === section);
    if (sectionItem) {
      scrollToSection(sectionItem.ref, section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      for (const item of menuItems) {
        if (
          item.ref.current &&
          scrollPosition >= item.ref.current.offsetTop - 100
        ) {
          setActiveSection(item.name);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  // 3D Card component
  const Card3D = ({
    children,
    className,
    onHoverStart,
    onHoverEnd,
    imageId,
  }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(
      mouseYSpring,
      [-0.5, 0.5],
      ["17.5deg", "-17.5deg"]
    );
    const rotateY = useTransform(
      mouseXSpring,
      [-0.5, 0.5],
      ["-17.5deg", "17.5deg"]
    );

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          handleMouseLeave();
          onHoverEnd && onHoverEnd();
          setFocusedImage(null);
        }}
        onHoverStart={() => {
          onHoverStart && onHoverStart();
          setFocusedImage(imageId);
        }}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className={`${className} relative transition-all duration-200 ease-out`}
      >
        <div
          style={{ transform: "translateZ(75px)" }}
          className="absolute inset-4"
        >
          {children}
        </div>
      </motion.div>
    );
  };

  const handleAnalyzeClick = () => {
    setShowSignupModal(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email,
        password,
      });
      if (response.data.success) {
        setShowSignupModal(false);
        setShowLoginModal(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("User already exist");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      if (response.data.success) {
        setShowLoginModal(false);
        setShowAnalysis(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Sign-up with your email");
    }
  };

  const handleLogout = () => {
    setShowAnalysis(false);
  };

  const handleCancel = () => {
    setShowSignupModal(false);
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleGetStarted = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection("analysis");
  };

  return (
    <div className="bg-black">
      {showAnalysis ? (
        <Analysis onLogout={handleLogout} />
      ) : (
        <div className="text-white font-raleway">
          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap");

            body {
              font-family: "Raleway", sans-serif;
            }

            ::-webkit-scrollbar {
              width: 6px;
            }
            ::-webkit-scrollbar-track {
              background: #000000;
            }
            ::-webkit-scrollbar-thumb {
              background: #ffffff;
              border-radius: 3px;
            }
          `}</style>
          {showOpeningAnimation && (
            <OpeningAnimation
              onAnimationComplete={() => setShowOpeningAnimation(false)}
            />
          )}
          {/* navbar */}
          <AnimatePresence>
            {!showOpeningAnimation && (
              <motion.nav
                className="flex items-center justify-between p-6 sticky top-0 bg-black/80 backdrop-blur-md z-50"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center">
                  <button onClick={() => navigateToSection("home")}>
                    <img src="kanini.png" alt="Logo" className="w-8 h-8 mr-2" />
                  </button>
                  <button
                    onClick={() => navigateToSection("home")}
                    className="text-xl font-semibold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-200"
                  >
                    K-INSURE
                  </button>
                </div>
                <div className="lg:hidden">
                  <button
                    onClick={toggleMenu}
                    className="text-white"
                    aria-label="Toggle menu"
                  >
                    {isMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
                  </button>
                </div>
                <ul
                  className={`lg:flex lg:space-x-48 ${
                    isMenuOpen
                      ? "block absolute top-full left-0 right-0 bg-black/80 backdrop-blur-md p-4"
                      : "hidden"
                  } lg:relative lg:top-auto lg:left-auto lg:right-auto lg:bg-transparent lg:p-0`}
                >
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.name}
                      className="mb-4 lg:mb-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => {
                          navigateToSection(item.name);
                          setIsMenuOpen(false);
                        }}
                        className={`text-sm font-bold uppercase tracking-wider hover:text-gray-300 ${
                          activeSection === item.name ? "text-blue-400" : ""
                        }`}
                      >
                        {item.name}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
          {/* home page */}
          <div ref={heroRef} className="relative h-screen overflow-hidden">
            <div className="absolute inset-0">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </div>

            <div className="flex flex-col items-center justify-center h-full relative z-10">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 tracking-tighter leading-none text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-100"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                K-Insure
              </motion.h1>
              <motion.p
                className="text-sm sm:text-base md:text-lg lg:text-xl mb-12 font-light max-w-xl leading-relaxed cursor-pointer text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                onMouseEnter={() => setIsTextHovered(true)}
                onMouseLeave={() => setIsTextHovered(false)}
                style={{
                  color: isTextHovered
                    ? "rgba(255, 255, 255, 0.6)"
                    : "rgba(255, 255, 255, 1)",
                  transition: "color 0.1s ease-in-out",
                }}
              >
                Trailblazers of insurance analytics visualization and statistics
                evaluation.
              </motion.p>
              <motion.button
                className="bg-gradient-to-r from-slate-300 to-slate-300 text-black px-8 py-4 rounded-full text-lg font-extrabold uppercase tracking-wide shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.01, delay: 0.01 }}
                onClick={handleGetStarted}
              >
                Get Started
              </motion.button>
            </div>
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <ChevronDown size={32} className="animate-bounce" />
            </motion.div>
          </div>
          {/* about page */}
          <motion.div
            ref={aboutRef}
            className="min-h-screen bg-black flex flex-col items-center justify-start pt-20 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.h2
              className="text-3xl font-extrabold mb-4"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Us
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base text-gray-300 mb-16 max-w-2xl text-center leading-relaxed"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              K-Insure is a new and upcoming part of Kanini Software Solutions
              India Pvt Ltd. Our product aims to equip our customers by
              delivering impactful insights and estimates. We enable our
              customers to make their best business decisions backed by
              simplified and visually appealing data.
            </motion.p>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("secure")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="secure"
                >
                  <motion.img
                    src="secure.png"
                    alt="Insights"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "secure"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 md:pl-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Analytic Insight View
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "secure" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Analytic Insight View provides a comprehensive exploratory
                  data analysis (EDA) view. It offers a range of interactive
                  visualizations, including churn rates, customer demographics,
                  and key performance indicators. This powerful tool allows you
                  to dive deep into the insurance data, uncovering trends and
                  patterns that drive informed decision-making and strategic
                  planning.
                </motion.p>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-16">
              <motion.div
                className="w-full md:w-1/2 md:pl-12 order-2 md:order-1"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Sentiment Analysis
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "health" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Sentiment Analysis view provides a comprehensive view of
                  customer feedback and opinions. It features interactive
                  visualizations of sentiment distribution, trends over time,
                  top feedback themes, and word clouds. The tool also offers
                  insights into sentiment across different age groups and its
                  impact on customer churn, enabling data-driven decisions to
                  enhance customer satisfaction and retention strategies.
                </motion.p>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0 order-1 md:order-2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("health")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="health"
                >
                  <motion.img
                    src="health.png"
                    alt="Health Insurance"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "health"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-16">
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("safe")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="safe"
                >
                  <motion.img
                    src="safe.png"
                    alt="Customer Segmentation"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "safe"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 md:pl-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Customer Segmentation
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "safe" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Customer Segmentation tool employs RFM (Recency,
                  Frequency, Monetary) analysis to categorize customers into
                  distinct groups. It features an interactive pie chart
                  visualizing the distribution of customer segments and a
                  detailed table displaying individual customer RFM scores and
                  labels. This powerful segmentation enables targeted marketing
                  strategies, personalized customer experiences, and data-driven
                  decision-making to optimize customer retention and value.
                </motion.p>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-16">
              <motion.div
                className="w-full md:w-1/2 md:pl-12 order-2 md:order-1"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Attrition Analysis
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "churn" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Attrition Analysis tool offers a sophisticated Customer
                  Attrition Prediction system. It allows you to input detailed
                  customer information across various categories such as
                  insurance type, product plan, demographics, and financial
                  indicators. This empowers our team to take proactive measures
                  in customer retention, tailor personalized strategies, and
                  optimize business decisions to reduce attrition rates
                  effectively.
                </motion.p>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0 order-1 md:order-2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("churn")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="churn"
                >
                  <motion.img
                    src="churn.png"
                    alt="Attrition Analysis"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "churn"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-16">
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("ind")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="ind"
                >
                  <motion.img
                    src="ind.png"
                    alt="Individual Customer View"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "ind"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 md:pl-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Individual Customer View
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "ind" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Individual Customer View provides a comprehensive
                  360-degree perspective of each customer. It offers detailed
                  insights across multiple dimensions, including personal
                  information, metrics, LOB-specific data, interaction history,
                  risk factors, feedback, policy details, claims history,
                  loyalty program status, risk profile, financial overview, and
                  personalized recommendations. This powerful tool enables
                  insurance professionals to access a wealth of customer data
                  through an intuitive, interactive view, facilitating
                  data-driven decision-making and personalized customer service
                  strategies.
                </motion.p>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-16">
              <motion.div
                className="w-full md:w-1/2 md:pl-12 order-2 md:order-1"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Geographical View
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "world" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Geographical View feature offers an interactive map of
                  India, providing a visual representation of insurance data
                  across different regions. Our Team can hover over markers to
                  view quick stats and click for detailed regional information.
                  This powerful tool allows for easy identification of high-risk
                  areas, regional performance comparisons, and insights into key
                  metrics such as churn risk, customer satisfaction, loyalty,
                  and engagement scores, enabling data-driven decision-making
                  and targeted regional strategies.
                </motion.p>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0 order-1 md:order-2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("world")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="world"
                >
                  <motion.img
                    src="world.png"
                    alt="Geographical View"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "world"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-16">
              <motion.div
                className="w-full md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card3D
                  className="rounded-lg shadow-2xl w-full max-w-sm mx-auto h-64 bg-gradient-to-br from-black to-black"
                  onHoverStart={() => setHoveredImage("damage")}
                  onHoverEnd={() => setHoveredImage(null)}
                  imageId="damage"
                >
                  <motion.img
                    src="damage.png"
                    alt="Cost deduction for car damage"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      scale: imageScale,
                      opacity: imageOpacity,
                      rotateY: imageRotation,
                      filter:
                        focusedImage && focusedImage !== "damage"
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                  />
                </Card3D>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2 md:pl-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.h3
                  className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Cost deduction for car damage
                </motion.h3>
                <motion.p
                  className={`text-lg leading-relaxed transition-colors duration-300 ${
                    hoveredImage === "damage" ? "text-white" : "text-gray-600"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Car Damage Assessment tool provides a comprehensive and
                  intelligent analysis of vehicle damage. This includes a visual
                  overlay of detected damage, a breakdown of damage types and
                  severities, cost estimates for repairs, and additional
                  insights such as repair time estimates and recommendations.
                  This powerful tool enables quick, accurate assessments for
                  insurance claims, repair planning, and cost estimations,
                  streamlining the entire damage assessment process.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* analysis page */}
          <motion.div
            ref={analysisRef}
            className="min-h-screen bg-black flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.h2
              className="text-3xl font-extrabold mb-8"
              initial={{ y: -50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Analysis
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 max-w-2xl text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Our cutting-edge analysis tools provide deep insights into
              insurance trends and patterns, helping you make data-driven
              decisions for your business.
            </motion.p>
            <br />
            <motion.button
              className="bg-gradient-to-r from-slate-300 to-slate-300 text-black px-8 py-4 rounded-full text-lg font-extrabold tracking-wide shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.01, delay: 0.01 }}
              onClick={handleAnalyzeClick}
            >
              Analyse
            </motion.button>

            {/* Signup Modal */}
            <AnimatePresence>
              {showSignupModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl w-full max-w-md"
                  >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                      Join K-Insure
                    </h2>
                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                      </div>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                        >
                          Sign Up
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    {error && (
                      <p className="text-red-500 mt-4 text-center font-semibold">
                        {error}
                      </p>
                    )}
                    <p className="mt-6 text-sm text-gray-400 text-center">
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setShowSignupModal(false);
                          setShowLoginModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition duration-300"
                      >
                        Log in
                      </button>
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Modal */}
            <AnimatePresence>
              {showLoginModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl w-full max-w-md"
                  >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                      Welcome Back
                    </h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                      </div>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                        >
                          Log In
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    {error && (
                      <p className="text-red-500 mt-4 text-center font-semibold">
                        {error}
                      </p>
                    )}
                    <p className="mt-6 text-sm text-gray-400 text-center">
                      Don't have an account?{" "}
                      <button
                        onClick={() => {
                          setShowLoginModal(false);
                          setShowSignupModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition duration-300"
                      >
                        Sign up
                      </button>
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* contact page */}
          <motion.div
            ref={contactRef}
            className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.h2
              className="text-3xl font-extrabold mb-16"
              initial={{ y: -50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Contact Us
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
              <motion.div
                className="flex flex-col space-y-8"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ContactCard
                  icon={<Mail className="text-blue-400" size={24} />}
                  title="Email"
                  content="K-insure@outlook.com"
                  link="mailto:K-insure@outlook.com"
                />
                <ContactCard
                  icon={<Phone className="text-green-400" size={24} />}
                  title="Phone"
                  content="+91 4224639800"
                  link="tel:+91 4224639800"
                />
              </motion.div>
              <motion.div
                className="flex flex-col space-y-8"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ContactCard
                  icon={<Linkedin className="text-blue-600" size={24} />}
                  title="LinkedIn"
                  content="Connect with us"
                  link="https://www.linkedin.com/company/kanini/"
                />
                <ContactCard
                  icon={
                    <img
                      src="kanini.png"
                      alt="Kanini Logo"
                      className="w-6 h-6"
                    />
                  }
                  title="Website"
                  content="Visit our website"
                  link="https://www.kanini.com"
                />
              </motion.div>
            </div>

            {/* New footer section */}
            <footer className="w-full max-w-7xl mx-auto mt-16 text-xs">
              <div className="flex flex-wrap justify-center gap-8 mb-6">
                <div className="w-40">
                  <h3 className="font-semibold mb-2 text-center">Products</h3>
                  <ul className="space-y-1 text-center">
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Health Insurance
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Travel Insurance
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Home Insurance
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Auto Insurance
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-40">
                  <h3 className="font-semibold mb-2 text-center">Services</h3>
                  <ul className="space-y-1 text-center">
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Claims Processing
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Policy Management
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Risk Assessment
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Customer Support
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-40">
                  <h3 className="font-semibold mb-2 text-center">Resources</h3>
                  <ul className="space-y-1 text-center">
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        API Reference
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Tutorials
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-40">
                  <h3 className="font-semibold mb-2 text-center">Company</h3>
                  <ul className="space-y-1 text-center">
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Press
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-40">
                  <h3 className="font-semibold mb-2 text-center">Legal</h3>
                  <ul className="space-y-1 text-center">
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Cookie Policy
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        GDPR Compliance
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-40">
                  <h3 className="font-semibold mb-2 text-center">Connect</h3>
                  <ul className="space-y-1 text-center">
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        X
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/company/kanini/"
                        className="text-gray-400 hover:text-white"
                      >
                        LinkedIn
                      </a>
                    </li>
                    <li>
                      <a href=" " className="text-gray-400 hover:text-white">
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="/" className="text-gray-400 hover:text-white">
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-xs">
                  Copyright © 2024 K-Insure Inc. All rights reserved.
                </p>
                <div className="flex space-x-4 mt-2 md:mt-0 text-xs">
                  <a href=" " className="text-gray-400 hover:text-white">
                    Terms of Use
                  </a>
                  <a href=" " className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                  <a href=" " className="text-gray-400 hover:text-white">
                    Agreements and Guidelines
                  </a>
                </div>
              </div>
            </footer>
            <br />
          </motion.div>
        </div>
      )}
    </div>
  );
}

const ContactCard = ({ icon, title, content, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-4 group"
    whileHover={{ scale: 1.05 }}
  >
    <div className="bg-gray-800 p-3 rounded-full group-hover:bg-gray-700 transition-colors duration-300">
      {icon}
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
        {content}
      </p>
    </div>
    <motion.div
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      initial={{ x: -10 }}
      animate={{ x: 0 }}
    >
      <ChevronDown className="transform rotate-270 text-blue-400" size={20} />
    </motion.div>
  </motion.a>
);
