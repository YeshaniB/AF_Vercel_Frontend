import { motion } from 'framer-motion';

const LoadingAnimation = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${spinnerSize} flex items-center justify-center`}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            borderRadius: ["50% 50%", "40% 60%", "60% 40%", "50% 50%"]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            borderRadius: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`${spinnerSize} border-t-2 border-b-2 border-primary-500 rounded-full`}
        />
        <motion.div
          animate={{ 
            rotate: -180,
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
          }}
          className={`absolute ${spinnerSize} border-r-2 border-l-2 border-accent-400 rounded-full`}
          style={{ opacity: 0.7 }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;