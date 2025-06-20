"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CalendarClock, Film, TrendingUp } from "lucide-react";
import { useMovieStore } from "@/lib/movies";
import { useEffect } from "react";
import { MovieCard } from "@/components/movies/movie-card";
import { GenreCard } from "@/components/movies/genre-card";
import { HeroBanner } from "@/components/home/hero-banner";

export default function Home() {
  const { movies, getMovies } = useMovieStore();

  const genres = [
    {
      name: "Action",
      iconName: "Swords",
      color: "from-red-500 to-orange-500",
      count: 12,
    },
    {
      name: "Comedy",
      iconName: "Smile",
      color: "from-yellow-400 to-orange-400",
      count: 8,
    },
    {
      name: "Drama",
      iconName: "Heart",
      color: "from-purple-500 to-pink-500",
      count: 15,
    },
    {
      name: "Sci-Fi",
      iconName: "Rocket",
      color: "from-blue-500 to-cyan-500",
      count: 10,
    },
    {
      name: "Thriller",
      iconName: "Zap",
      color: "from-gray-700 to-gray-900",
      count: 7,
    },
    {
      name: "Romance",
      iconName: "Heart",
      color: "from-pink-400 to-rose-500",
      count: 6,
    },
  ];

  const fetchMovies = async () => {
    await getMovies();
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navbar */}
      <nav className="sticky px-0 md:px-20 top-0 z-50 w-full border-b backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Film className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              CinemaSeats
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <HeroBanner featuredMovie={movies[0]} />

      {/* Genre Section */}
      <section className="container mx-auto px-4 md:px-24 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Browse by Genre
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover movies across all your favorite genres
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre, index) => (
            <GenreCard key={genre.name} genre={genre} index={index} />
          ))}
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="container mx-auto px-4 md:px-24 py-16">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Now Showing
            </h2>
            <p className="text-muted-foreground">Latest releases in theaters</p>
          </div>
          <Link href="/movies">
            <Button
              variant="outline"
              className="hover:bg-primary/10 border-primary/20"
            >
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 md:px-24 py-16">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Trending Now
              </h2>
              <p className="text-muted-foreground">
                Most popular movies this week
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} trending />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 md:px-24 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            The Ultimate Movie Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Book your perfect seats with our advanced booking system
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {[
            {
              icon: Film,
              title: "Premium Selection",
              description:
                "Curated collection of the latest blockbusters and indie gems",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: CalendarClock,
              title: "Smart Scheduling",
              description: "AI-powered recommendations for the best showtimes",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: TrendingUp,
              title: "Interactive Seating",
              description: "3D seat selection with real-time availability",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((feature, index) => (
            <div key={index} className="group relative">
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl blur-xl"
                style={{
                  background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />
              <div className="relative flex flex-col items-center text-center space-y-6 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all group-hover:scale-105 group-hover:shadow-2xl">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-24 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-12 text-center shadow-2xl">
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%3E%3Cg%3E%3Cg%3E%3Ccircle/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            fill-rule="evenodd"
            fill="%23ffffff"
            fill-opacity="0.05"
            cx="30"
            cy="30"
            r="4"
          />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready for Your Next Movie Night?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of movie lovers and book your perfect cinema
              experience today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-3 text-lg font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/movies">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                >
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-24 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CinemaSeats
              </span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2025 CinemaSeats. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
