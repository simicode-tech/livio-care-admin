"use client";

import { motion } from "framer-motion";

export function AuthIllustration() {
  return (
    <div className="h-screen sticky rounded-tr-3xl bg-[#FDF7FA] w-1/2 hidden lg:flex items-center justify-center">
      <div className="relative w-[500px] h-[500px]">
        {/* Background circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        
        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20"
        >
          <div className="w-20 h-20 bg-primary rounded-lg shadow-lg flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-4xl"
            >
              👨‍⚕️
            </motion.div>
          </div>
        </motion.div>

        {/* Additional floating elements */}
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-20 right-20"
        >
          <div className="w-20 h-20 bg-primary rounded-full shadow-lg flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-4xl"
            >
              🏥
            </motion.div>
          </div>
        </motion.div>

        {/* Center element */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-32 h-32 bg-primary rounded-2xl shadow-xl flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-white text-6xl"
            >
              ⚕️
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative dots */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}