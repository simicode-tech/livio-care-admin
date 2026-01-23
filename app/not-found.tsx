"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

const rocketVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const starVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F9FAFB] overflow-hidden">
      <div className="flex items-center gap-20">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-9xl font-bold text-primary"
          >
            404
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-gray-500">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-primary hover:bg-purple-700"
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </div>

        <div className="relative w-96 h-96">
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              variants={starVariants}
              animate="animate"
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          {/* Rocket */}
          <motion.div
            variants={rocketVariants}
            animate="animate"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M12 2L8 6V12L4 16H20L16 12V6L12 2Z"
                fill="#5D055E"
                stroke="#4C1D95"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M12 2V8"
                stroke="#5D055E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M8 12H16"
                stroke="#5D055E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Flame animation */}
              <motion.path
                d="M10 16V20M14 16V20"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{
                  scaleY: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}