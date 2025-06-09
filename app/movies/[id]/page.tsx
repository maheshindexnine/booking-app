import { MovieDetail } from "@/components/movies/movie-detail";


export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return <MovieDetail movieId={params.id} />;
}