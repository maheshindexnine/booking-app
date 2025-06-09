"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  ChevronLeft,
  Clock,
  Film,
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
import Image from "next/image";
import { formatDuration, getNextDateItems } from "@/utils/common";
import { useSeatStore } from "@/lib/seats";

interface MovieDetailProps {
  movieId: string;
}

export function MovieDetail({ movieId }: MovieDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getSchedules, schedules } = useEventScheduleStore();
  const { getSeats, seats } = useSeatStore();
  const {
    getMovieById,
    selectedMovie,
    clearSelectedSeats,
    selectedSeats,
    toggleSeatSelection,
    getSchedulesForMovie,
    getSeatsForSchedule,
    selectedSchedule,
  } = useMovieStore();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  // const [seats, setSeats] = useState<ReturnType<typeof getSeatsForSchedule>>(
  //   []
  // );
  const [seatPrices, setSeatPrices] = useState<Record<string, number>>({});
  const [step, setStep] = useState<"date" | "theater" | "seats">("date");
  const role = user?.type || "user";

  const getMovieDetails = async () => {
    await getMovieById(movieId);
  };

  const getTheaterLists = async () => {
    await getSchedules();
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
    if (selectedSchedule) {
      const scheduleSeats = getSeatsForSchedule(selectedSchedule.id);
      // setSeats(scheduleSeats);

      // Set seat prices based on the selected schedule
      const priceMap: Record<string, number> = {};
      selectedSchedule.seatTypes.forEach((seatType) => {
        priceMap[seatType.name] = seatType.price;
      });
      setSeatPrices(priceMap);
    }
  }, [selectedSchedule, getSeatsForSchedule]);

  useEffect(() => {
    if (selectedTheater) {
      getSeatLists();
    }
  }, [selectedTheater]);

  if (!selectedMovie) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav role={role} />
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

  // Get unique dates from schedules
  // const uniqueDates = [...new Set(schedules.map((schedule) => schedule.date))];

  const uniqueDates = getNextDateItems(5);
  // Get unique theaters for selected date

  // const theaters = [
  //   ...new Set(
  //     schedules
  //       .filter((schedule) => schedule.date === selectedDate)
  //       .map((schedule) => schedule.companyId)
  //   ),
  // ].map((theaterId) => {
  //   const schedule = schedules.find((s) => s.companyId === theaterId);
  //   return {
  //     id: theaterId,
  //     name: schedule?.companyName || "Unknown Theater",
  //   };
  // });

  const handleTheaterSelect = (theaterId: string) => {
    setSelectedTheater(theaterId);
    clearSelectedSeats();
    setStep("seats");
  };

  const handleBooking = () => {
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
      const booking = createBooking(user.id);

      toast({
        title: "Booking Successful!",
        description: `You've booked ${selectedSeats.length} seats for ${movie.name}`,
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
      <MainNav role={role} />

      <div className="px-4 md:mx-32 py-8">
        <Link
          href="/movies"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Movies
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Movie Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden h-full bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg">
              <div className="relative aspect-[2/3]">
                <img
                  src={selectedMovie.image}
                  alt={selectedMovie.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-3">
                  {selectedMovie.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMovie.genre.map((genre, i) => (
                    <Badge key={i} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDuration(selectedMovie.duration)}</span>
                </div>
                <p className="text-muted-foreground">
                  {selectedMovie.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

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
                          clearSelectedSeats();
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
                      <div className="flex items-center mb-4">
                        <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Select Theater:
                        </span>
                      </div>
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
                            onClick={() => handleTheaterSelect(theater._id)}
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
                        seats={seats}
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
