"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown, FilterX, X } from "lucide-react";
import { Movie } from "@/types";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface MovieFilterProps {
  movies: Movie[];
  onFilter: (filteredMovies: Movie[]) => void;
}

export function MovieFilter({ movies, onFilter }: MovieFilterProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Extract all unique genres
  const allGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genre))
  ).sort();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedDate(undefined);
  };

  const applyFilters = () => {
    let filteredResults = [...movies];

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filteredResults = filteredResults.filter((movie) =>
        selectedGenres.some((genre) => movie.genre.includes(genre))
      );
    }

    // In a real app, we would also filter by date using the schedules data
    // For now, we'll just apply the genre filter
    
    onFilter(filteredResults);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedGenres, selectedDate]);

  const hasActiveFilters = selectedGenres.length > 0 || selectedDate;

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-medium">
        Showing {movies.length} movies
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={isGenreOpen} onOpenChange={setIsGenreOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed">
              <ChevronDown className="mr-2 h-4 w-4" />
              Genre
              {selectedGenres.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {selectedGenres.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="end">
            <div className="p-2">
              {allGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <div
                    key={genre}
                    className="flex cursor-pointer items-center py-1 px-2 rounded-md hover:bg-muted"
                    onClick={() => toggleGenre(genre)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm">{genre}</span>
                  </div>
                );
              })}
            </div>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setSelectedGenres([])}
              >
                Clear filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed">
              <ChevronDown className="mr-2 h-4 w-4" />
              Date
              {selectedDate && (
                <Badge className="ml-2 bg-primary text-primary-foreground">1</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => setSelectedDate(undefined)}
              >
                Clear date
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-9"
          >
            <X className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-full px-1 text-xs font-medium", className)}>
      {children}
    </div>
  );
}