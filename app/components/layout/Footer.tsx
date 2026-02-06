"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSecretClick = () => {
    if (resetTimeout.current) clearTimeout(resetTimeout.current);

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      router.push("/admin");
      setClickCount(0);
      return;
    }

    resetTimeout.current = setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <footer className="border-t border-gray-700 bg-gradient-to-b from-[#0b0d11] to-[#08090b]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Podcast. Tous droits réservés.
            </p>
            <p className="text-xs text-gray-500">
              Application développée par{" "}
              <span className="text-gray-300 font-medium">
                Steve Bodouin
              </span>{" "}
              · Software Engineer
            </p>
          </div>

          <motion.div
            className="flex items-center gap-2 text-sm text-gray-400"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span>Fait avec</span>
            <button
              onClick={handleSecretClick}
              className="focus:outline-none"
              aria-label="Admin access"
            >
              <Heart className="w-4 h-4 text-yellow-500 fill-current hover:scale-110 transition-transform" />
            </button>
            <span>et passion</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
