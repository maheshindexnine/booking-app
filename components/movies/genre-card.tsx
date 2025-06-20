"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Swords,
  Smile,
  Heart,
  Rocket,
  Zap,
  DivideIcon as LucideIcon,
  LucideIcon,
} from "lucide-react";

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Swords,
  Smile,
  Heart,
  Rocket,
  Zap,
};

interface Genre {
  name: string;
  iconName: string;
  color: string;
  count: number;
}

interface GenreCardProps {
  genre: Genre;
  index: number;
}

export function GenreCard({ genre, index }: GenreCardProps) {
  const router = useRouter();
  const IconComponent = iconMap[genre.iconName] || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => router.push(`/movies?genre=${genre.name.toLowerCase()}`)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-square">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
        />

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%3E%3Cg%3E%3Cg%3E%3Ccircle/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          fill-rule="evenodd"
          fill="%23ffffff"
          fill-opacity="0.1"
          cx="30"
          cy="30"
          r="4"
        />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="mb-3"
          >
            <IconComponent className="h-8 w-8 md:h-10 md:w-10" />
          </motion.div>

          <h3 className="font-bold text-sm md:text-base text-center mb-1">
            {genre.name}
          </h3>

          <p className="text-xs text-white/80">{genre.count} movies</p>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </div>
    </motion.div>
  );
}
