"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CalendarClock, Film, TrendingUp } from "lucide-react";
import { useMovieStore } from "@/lib/movies";
import MovieCardNew from "@/components/movies/movie-card-new";
import { useEffect } from "react";

export default function Home() {
  const { movies, getMovies } = useMovieStore();

  const fetchMovies = async () => {
    await getMovies();
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80">
        <div className="px-4 md:mx-32 mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CinemaSeats</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[url('/images/bg.jpg')] rounded-xl bg-cover bg-center bg-no-repeat px-4 md:mx-32 pt-16 md:pt-24 lg:pt-32">
        {/* Overlay for dimming */}
        <div className="absolute inset-0 bg-black opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center opacity-50">
          <h1 className="text-xl md:text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl text-white">
            Book your perfect movie experience
          </h1>
          <p className="mt-6 max-w-3xl text-xs md:text-lg text-muted-foreground text-neutral-200">
            Find the best seats, at the best theaters, for all your favorite
            movies. Simple booking, amazing experience.
          </p>
          <div className="my-10 flex flex-wrap gap-4 justify-center">
            <Link href="/movies">
              <Button size="lg" className="rounded-full px-8">
                Browse Movies
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="px-4 md:mx-32 mx-auto py-10">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Now Showing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
            // <MovieCard key={movie.id} movie={movie} featured={index === 0} />
            <MovieCardNew key={movie.id} movie={movie} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/movies">
            <Button variant="outline" size="lg">
              View All Movies
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:mx-32 mx-auto px-4 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-16">
          The perfect movie booking experience
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Film className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Wide Movie Selection</h3>
            <p className="text-muted-foreground">
              Browse through hundreds of the latest movies and find something
              for everyone.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CalendarClock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Easy Scheduling</h3>
            <p className="text-muted-foreground">
              Find convenient showtimes that fit your schedule with our
              easy-to-use calendar.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Interactive Seat Selection</h3>
            <p className="text-muted-foreground">
              Choose your perfect seats with our interactive seat map and
              real-time availability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
