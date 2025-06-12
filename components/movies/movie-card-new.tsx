"use client";
import React, { useMemo, useState } from "react";
import { Star, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types";
import { useRouter } from "next/navigation";

const getRandomHoverColor = (): string => {
  const colors = [
    "hover:bg-red-600",
    "hover:bg-green-600",
    "hover:bg-blue-600",
    "hover:bg-yellow-600",
    "hover:bg-purple-600",
    "hover:bg-pink-600",
    "hover:bg-orange-600",
    "hover:bg-teal-600",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const MovieCardNew = ({
  movie,
  showBtn = true,
}: {
  movie: Movie;
  showBtn?: boolean;
}) => {
  const router = useRouter();
  const [genres] = useState<string[]>(movie.genre.slice(0, 2));

  const genreStyles = useMemo(
    () =>
      genres.map((genre) => ({
        label: genre,
        hoverClass: getRandomHoverColor(),
      })),
    [genres]
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-96 rounded-2xl"
    >
      <img
        src={movie.image}
        alt="image-failed"
        className="opacity-1 w-full h-full
           shadow-2xl rounded-lg rounded-br-[100px]"
      />
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-neutral-800 to-transparent rounded-br-[100px] rounded-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 flex justify-between w-full p-3">
        <div className="w-3/4 space-y-2">
          <div className="flex justify-between">
            <div className="space-x-2">
              <motion.span
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-lg font-semibold text-white"
              >
                {movie.name}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-xs text-neutral-300"
              >
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </motion.span>
            </div>
            <span className="text-xs text-neutral-700 flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold text-neutral-300 text-md">{movie.rating}</span>
            </span>
          </div>
          <div className="flex gap-2">
            {genreStyles.map(({ label, hoverClass }, idx) => (
              <motion.p
                key={idx}
                whileHover={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`text-xs text-neutral-300  border-2 border-neutral-700 rounded-2xl px-2 py-0 cursor-pointer capitalize hover:scale-125 hover:text-white ${hoverClass}`}
              >
                {label}
              </motion.p>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-xs font-thin text-neutral-300"
          >
            {movie.description}
          </motion.p>
        </div>
        {showBtn && (
          <div className="w-1/4 flex justify-end items-end absolute right-0 bottom-0 pb-2">
            <div className="group relative">
              <button
                onClick={() => router.push(`/movies/${movie._id}`)}
                className="
        bg-red-500 
        rounded-full 
        pl-4 pr-4 
        py-3 
        flex 
        items-center 
        overflow-hidden 
        transition-all 
        duration-300 
        ease-in-out 
        group-hover:pr-6 
        group-hover:pl-5
        group-hover:rounded-2xl
      "
              >
                <Ticket className="w-6 h-6 text-white" />
                <span
                  className="
          ml-2 
          text-white 
          text-sm 
          whitespace-nowrap 
          opacity-0 
          scale-0 
          w-0
          group-hover:w-16
          group-hover:opacity-100 
          group-hover:scale-100 
          transition-all 
          duration-300
        "
                >
                  Book Now
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCardNew;
