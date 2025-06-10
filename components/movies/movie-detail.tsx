"use client";

import { useState, useEffect } from "react";
import { useMovieStore } from "@/lib/movies";
import { useAuth } from "@/lib/auth";
import { MainNav } from "@/components/layout/main-nav";
import { SeatSelector } from "@/components/booking/seat-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  ChevronLeft,
  CalendarDays,
  Building2,
  TicketCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEventScheduleStore } from "@/lib/eventSchedules";
import { getNextDateItems } from "@/utils/common";
import { useSeatStore } from "@/lib/seats";
import MovieCardNew from "./movie-card-new";
import { UserRole } from "@/types";

interface MovieDetailProps {
  movieId: string;
}

export function MovieDetail({ movieId }: MovieDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getSchedules, schedules } = useEventScheduleStore();
  const { getSeats, seats } = useSeatStore();
  const { getMovieById, selectedMovie, selectedSeats, toggleSeatSelection } =
    useMovieStore();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const { bookSeat } = useSeatStore();
  const [seatPrices, setSeatPrices] = useState<Record<string, number>>({});
  const [step, setStep] = useState<"date" | "theater" | "seats">("date");
  const role = user?.type || "user";

  // Convert Seat[] to EventSeat[]
  const eventSeats = seats.map(seat => ({
    ...seat,
    row: seat.row || "A" // Provide default value for optional row
  }));

  const getMovieDetails = async () => {
    await getMovieById(movieId);
  };

  const getTheaterLists = async () => {
    await getSchedules({ date: selectedDate });
  };

  const getSeatLists = async () => {
    await getSeats({ eventScheduleId: selectedTheater });
  };

  useEffect(() => {
    if (movieId) getMovieDetails();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      getTheaterLists();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTheater) {
      getSeatLists();
    }
  }, [selectedTheater]);

  if (!selectedMovie) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav role={role as UserRole} />
        <div className="px-4 md:mx-32 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The movie you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/movies">Back to Movies</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const uniqueDates = getNextDateItems(5);

  const handleTheaterSelect = (theaterId: string) => {
    setSelectedTheater(theaterId);
    setStep("seats");
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book tickets",
        variant: "destructive",
      });
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      await bookSeat({ id: selectedSeats[0]._id, booked: true });

      toast({
        title: "Booking Successful!",
        description: `You've booked ${selectedSeats.length} seats.`,
      });

      router.push("/bookings");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role={role as UserRole} />

      <div className="px-4 md:mx-32 py-8">
        <Link
          href="/movies"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Movies
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <MovieCardNew movie={selectedMovie} showBtn={false} />

          {/* Booking Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Book Tickets</CardTitle>
                <CardDescription>
                  Select your preferred date and theater
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Date Selection */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Select Date:</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {uniqueDates.map((date) => (
                      <Button
                        key={date.value}
                        variant={
                          selectedDate === date.value ? "default" : "outline"
                        }
                        onClick={() => {
                          setSelectedDate(date.value);
                          setSelectedTheater("");
                          setStep("theater");
                        }}
                        className="flex-shrink-0"
                      >
                        {format(new Date(date.label), "EEE, MMM d")}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Theater Selection */}
                <AnimatePresence mode="wait">
                  {(step === "theater" || step === "seats") && selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-8"
                    >
                      {schedules.length > 0 && (
                        <div className="flex items-center mb-4">
                          <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Select Theater:
                          </span>
                        </div>
                      )}
                      {!schedules.length && (
                        <div className="grid gap-4">
                          <div className="text-center text-muted-foreground">
                            No theaters available for this date
                          </div>
                        </div>
                      )}
                      <div className="grid gap-4">
                        {schedules.map((theater) => (
                          <Button
                            key={theater._id}
                            variant={
                              selectedTheater === theater._id
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              handleTheaterSelect(theater._id || "")
                            }
                            className="justify-start h-auto py-4"
                          >
                            <div className="text-left">
                              <div className="font-medium">
                                {theater?.companyId?.name || ""}
                              </div>
                              <div className="text-sm opacity-70">
                                Available seats: Standard, Premium, VIP
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {/* Seat Selection */}
                  {step === "seats" && selectedTheater && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <SeatSelector
                        seats={eventSeats}
                        selectedSeats={selectedSeats}
                        onSelectSeat={toggleSeatSelection}
                        seatPrices={seatPrices}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              {step === "seats" && (
                <CardFooter>
                  <Button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0}
                    className="w-full"
                  >
                    <TicketCheck className="mr-2 h-5 w-5" />
                    Book {selectedSeats.length}{" "}
                    {selectedSeats.length === 1 ? "Seat" : "Seats"}
                    {selectedSeats.length > 0 && (
                      <span className="ml-2">
                        ($
                        {selectedSeats
                          .reduce(
                            (sum, seat) =>
                              sum + (seatPrices[seat.seatName] || 0),
                            0
                          )
                          .toFixed(2)}
                        )
                      </span>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Badge({
  variant,
  className,
  ...props
}: {
  variant?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "secondary"
          ? "bg-secondary text-secondary-foreground"
          : "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}
