"use client";

import { motion } from "framer-motion";
import { Stethoscope, Heartbeat, Wheelchair, FirstAid, Syringe, Hospital } from "@/components/icons/medical";

const floatingIcons = [
  { Icon: Stethoscope, label: "Patient Care" },
  { Icon: Heartbeat, label: "Health Monitoring" },
  { Icon: Wheelchair, label: "Accessibility" },
  { Icon: FirstAid, label: "Emergency Care" },
  { Icon: Syringe, label: "Medical Treatment" },
  { Icon: Hospital, label: "Facilities" },
];

export function AuthIllustration() {
  return (
    <div className="h-screen sticky top-0 left-0 rounded-tr-3xl bg-gradient-to-br from-[#F9F5FF] to-[#FDF7FA] w-1/2 hidden lg:flex items-center justify-center">
      <div className="relative w-[600px] h-[600px]">
        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d="M300,300 C100,100 500,100 300,300"
            stroke="rgba(126, 34, 206, 0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>

        {/* Central pulse ring */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: [0.9, 1.1, 0.9],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[400px] h-[400px] rounded-full border-4 border-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        {/* Floating medical icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [20, -20, 20],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{
              top: `${50 + 35 * Math.sin(index * (Math.PI / 3))}%`,
              left: `${50 + 35 * Math.cos(index * (Math.PI / 3))}%`,
            }}
          >
            <div className="relative group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <item.Icon className="w-8 h-8 text-primary" />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-primary/80 whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </div>
          </motion.div>
        ))}

        {/* Center element with heartbeat animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0 0 rgba(126, 34, 206, 0.4)",
                "0 0 0 20px rgba(126, 34, 206, 0)",
                "0 0 0 0 rgba(126, 34, 206, 0.4)"
              ]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-32 bg-primary rounded-3xl shadow-xl flex items-center justify-center"
          >
            <motion.div className="text-white text-5xl">
              💜
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Background particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}