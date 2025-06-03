"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useMovieStore } from "@/lib/movies";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Film, Plus, Trash, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function MoviesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const { movies, addMovie, updateMovie, deleteMovie } = useMovieStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    genre: "",
    duration: "",
    image: "",
  });
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (isClient && (!user || user.type !== 'admin')) {
      router.push('/login');
    }
  }, [user, router, isClient]);

  if (!isClient || !user || user.type !== 'admin') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const movieData = {
        name: formData.name,
        type: 'movie' as const,
        description: formData.description,
        genre: formData.genre.split(',').map(g => g.trim()),
        duration: parseInt(formData.duration),
        image: formData.image,
        userId: user.id,
      };

      if (editingMovie) {
        updateMovie(editingMovie, movieData);
        toast({
          title: "Movie Updated",
          description: "The movie has been updated successfully.",
        });
      } else {
        addMovie(movieData);
        toast({
          title: "Movie Added",
          description: "The new movie has been added successfully.",
        });
      }

      setFormData({
        name: "",
        description: "",
        genre: "",
        duration: "",
        image: "",
      });
      setIsAddDialogOpen(false);
      setEditingMovie(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (movie: any) => {
    setEditingMovie(movie.id);
    setFormData({
      name: movie.name,
      description: movie.description,
      genre: movie.genre.join(', '),
      duration: movie.duration.toString(),
      image: movie.image,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (movieId: string) => {
    try {
      deleteMovie(movieId);
      toast({
        title: "Movie Deleted",
        description: "The movie has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the movie.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role="admin" />
      
      <div className="px-4 md:mx-32 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Movies
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage movies in the system
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Movie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
                <DialogDescription>
                  {editingMovie 
                    ? "Update the movie details below."
                    : "Fill in the details below to add a new movie."}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Movie Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="genre">Genres (comma-separated)</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Action, Drama, Sci-Fi"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/movie-image.jpg"
                    required
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {editingMovie ? "Update Movie" : "Add Movie"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{movie.name}</CardTitle>
                  <CardDescription>
                    {movie.genre.join(', ')} • {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {movie.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(movie)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(movie.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {movies.length === 0 && (
          <div className="text-center py-16">
            <Film className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">No Movies Yet</h2>
            <p className="text-muted-foreground mb-8">
              Get started by adding your first movie.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}