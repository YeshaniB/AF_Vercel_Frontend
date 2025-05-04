import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const ScrollAnimation = ({ 
  children, 
  animation = "fadeIn", 
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, threshold });
  const controls = useAnimation();

  // Animation variants
  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration, delay } }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration, delay, type: "spring", stiffness: 100 } }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration, delay, type: "spring", stiffness: 100 } }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { duration, delay, type: "spring", stiffness: 100 } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration, delay, type: "spring", stiffness: 100 } }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, isInView, once]);

  // Use the selected animation or fallback to fadeIn
  const selectedAnimation = variants[animation] || variants.fadeIn;
  
  // Return statement was missing
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedAnimation}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;