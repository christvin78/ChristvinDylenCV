"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { gsap, ScrollTrigger } from "gsap/all";
import Typed from "typed.js";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [showMeteors, setShowMeteors] = useState(true);
  const canvasRef = useRef(null);
  const typedRef = useRef(null);

  // Smooth scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Dark mode toggle
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // Smooth scroll function
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ====== Meteor Animation ======
  useEffect(() => {
    if (!showMeteors) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let meteors = [];
    let animationFrame;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Meteor {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 10 + 6;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = `rgba(255,255,255,${this.opacity})`;
      }
      draw() {
        ctx.beginPath();
        const endX = this.x - this.length * 0.5;
        const endY = this.y + this.length;
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "transparent");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      update() {
        this.x -= this.speed * 0.5;
        this.y += this.speed;
        if (this.y > canvas.height || this.x < 0) this.reset();
      }
    }

    for (let i = 0; i < 40; i++) meteors.push(new Meteor());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      meteors.forEach((m) => {
        m.update();
        m.draw();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [showMeteors]);

  // ====== Typed.js (Auto typing) ======
  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Creative Web Developer 💻",
        "UI/UX Designer 🎨",
        "Interactive Website Builder 🚀",
      ],
      typeSpeed: 60,
      backSpeed: 40,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  // ====== GSAP Scroll Animation ======
  useEffect(() => {
    gsap.utils.toArray("section").forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });
    });
  }, []);

  // ====== Framer Motion Variants ======
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <main>
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* Meteor Canvas */}
      {showMeteors && (
        <canvas
          ref={canvasRef}
          className="meteor-canvas"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Navbar */}
      <motion.nav
        className="navbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="logo">
          Christvin<span>Dylen</span>
        </h1>
        <ul className="nav-links">
          <li onClick={() => scrollTo("hero")}>Home</li>
          <li onClick={() => scrollTo("about")}>About</li>
          <li onClick={() => scrollTo("cv")}>CV</li>
          <li onClick={() => scrollTo("projects")}>Projects</li>
          <li onClick={() => scrollTo("contact")}>Contact</li>
        </ul>
        <div className="toggle-group">
          <button onClick={() => setShowMeteors(!showMeteors)} className="toggle-btn">
            {showMeteors ? "❌" : "☄️"}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <motion.div className="hero-overlay" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={stagger}>
          <motion.h2 variants={fadeInUp}>
            Hello, I&apos;m <span>Christvin Dylen</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="typing">
            <span ref={typedRef}></span>
          </motion.p>
          <motion.button
            variants={fadeInUp}
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo("projects")}
          >
            View My Work ↓
          </motion.button>
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section id="about" className="about" variants={fadeInUp}>
        <h2>About Me</h2>
        <p>
          I&apos;m a passionate developer focused on crafting visually stunning,
          user-friendly, and responsive websites. I love combining design
          aesthetics with clean, efficient code to bring digital ideas to life.
        </p>
      </motion.section>

      {/* CV Section */}
      <motion.section id="cv" className="cv-section" variants={fadeInUp}>
        <h2>My CV</h2>
        <p>
          You can view or download my latest Curriculum Vitae below to learn more
          about my experience, education, and technical skills.
        </p>

        <motion.div
          className="cv-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <img src="/CV.jpg" alt="Christvin Dylen CV" className="cv-image" />
        </motion.div>

        <motion.a
          href="/CVDOWLOAND.pdf"
          download="CVDOWLOAND.pdf"
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
        >
          📄 Download CV
        </motion.a>
      </motion.section>

      {/* Projects Section */}
      <motion.section id="projects" className="projects" variants={stagger}>
        <h2>My Projects</h2>
        <div className="project-grid">
          {[
            { img: "/GAME.png", title: "Game Website", desc: "Interactive web game using React & GSAP." },
            { img: "/MOVIE.png", title: "MOVIE", desc: "Next.js app with SSR & API integration." },
            { img: "/myCV.png", title: "CV", desc: "Smooth animations & responsive UI." },
          ].map((proj, i) => (
            <motion.div
              key={i}
              className="project-card"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <div className="project-image-container">
                <img src={proj.img} alt={proj.title} className="project-image" />
                <div className="project-overlay">
                  <h3>{proj.title}</h3>
                  <p>{proj.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section id="contact" className="contact" variants={fadeInUp}>
        <h2>Contact Me</h2>
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            alert("📩 Message sent successfully!");
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <motion.button
            type="submit"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </motion.section>

    </main>
  );
}
