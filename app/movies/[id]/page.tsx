import { mockMovies } from "@/lib/movies";
import { MovieDetail } from "@/components/movies/movie-detail";

// This generates the static paths at build time using the mock data directly
export function generateStaticParams() {
  return mockMovies.map((movie) => ({
    id: movie.id,
  }));
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return <MovieDetail movieId={params.id} />;
}