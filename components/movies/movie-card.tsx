"use client";

import { Movie } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Play, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
  index?: number;
  trending?: boolean;
}

export function MovieCard({
  movie,
  featured = false,
  index = 0,
  trending = false,
}: MovieCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={cn("group relative", featured && "md:col-span-2")}
    >
      <Card className="overflow-hidden h-full flex flex-col bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-border/50 hover:border-primary/20 group-hover:bg-card/80">
        <div
          className={cn(
            "relative overflow-hidden",
            featured ? "aspect-[16/9]" : "aspect-[2/3]"
          )}
        >
          {/* Trending Badge */}
          {trending && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
            >
              <TrendingUp className="h-3 w-3" />
              Trending
            </motion.div>
          )}

          {/* Movie Poster */}
          <div className="relative h-full overflow-hidden">
            <img
              src={movie.image}
              alt={movie.name}
              className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Play Button Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </motion.div>
          </div>

          {/* Genre Badges */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[60%]">
            {movie.genre.slice(0, 2).map((genre, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-black/50 backdrop-blur-sm text-white border-white/20 text-xs hover:bg-black/70 transition-colors"
                >
                  {genre}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <motion.h3
              className="text-lg md:text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              {movie.name}
            </motion.h3>

            <motion.div
              className="flex items-center gap-4 text-sm text-white/90"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>4.{Math.floor(Math.random() * 9) + 1}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="flex-grow p-4">
          <motion.p
            className="text-muted-foreground text-sm line-clamp-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {movie.description}
          </motion.p>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="p-4 pt-0">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300 group-hover:scale-105"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              <Play className="mr-2 h-4 w-4" />
              Book Now
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
