"use client";

import { Movie } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

export function MovieCard({ movie, featured = false }: MovieCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(featured && "md:col-span-2 md:row-span-2")}
    >
      <Card className="overflow-hidden h-full flex flex-col bg-card/60 backdrop-blur-sm shadow-md hover:shadow-xl transition-all border-2 border-border/50">
        <div
          className={cn(
            "relative overflow-hidden",
            featured ? "aspect-[2/1]" : "aspect-[2/3]"
          )}
        >
          <img
            src={movie.image}
            alt={movie.name}
            className="object-cover w-full h-full transition-all hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
            {movie.genre.slice(0, 2).map((genre, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                {genre}
              </Badge>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white line-clamp-2">
              {movie.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="flex-grow p-4">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {movie.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => router.push(`/movies/${movie._id}`)}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
