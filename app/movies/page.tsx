"use client";

import { useState, useEffect } from "react";
import { useMovieStore } from "@/lib/movies";
import { Movie } from "@/types";
import { MainNav } from "@/components/layout/main-nav";
import { useAuth } from "@/lib/auth";
import { MovieCard } from "@/components/movies/movie-card";
import { MovieFilter } from "@/components/movies/movie-filter";

export default function MoviesPage() {
  const { getMovies } = useMovieStore();
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const role = user?.type || 'user';

  useEffect(() => {
    const allMovies = getMovies();
    setMovies(allMovies);
  }, [getMovies]);

  const handleFilter = (filteredMovies: Movie[]) => {
    setMovies(filteredMovies);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role={role} />
      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Movies
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse and book tickets for the latest movies
          </p>
        </div>

        <MovieFilter movies={getMovies()} onFilter={handleFilter} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              featured={index === 0}
            />
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}