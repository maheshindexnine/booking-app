"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useMovieStore } from "@/lib/movies";
import { MainNav } from "@/components/layout/main-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventSchedule, Movie, Booking, EventSeat } from "@/types";
import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, Film, MapPin, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSeatStore } from "@/lib/seats";

export default function BookingsPage() {
  const { user } = useAuth();
  const { getBookingsForUser, getMovieById, schedules, eventSeats } =
    useMovieStore();

  // const [bookings, setBookings] = useState<Booking[]>([]);
  const role = user?.type || "user";

  const { getBookings, bookings } = useSeatStore();

  useEffect(() => {
    getBookings();
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav role="user" />
        <div className="flex-1 p-8">
          <Card className="p-6 max-w-md mx-auto text-center">
            <p>Please login to view your bookings</p>
          </Card>
        </div>
      </div>
    );
  }

  // Helper to get movie for a booking
  const getMovieForBooking = (booking: Booking): Movie | undefined => {
    const schedule = schedules.find((s) => s.id === booking.eventScheduleId);
    if (schedule) {
      return getMovieById(schedule.eventId);
    }
    return undefined;
  };

  // Helper to get schedule for a booking
  const getScheduleForBooking = (
    booking: Booking
  ): EventSchedule | undefined => {
    return schedules.find((s) => s.id === booking.eventScheduleId);
  };

  // Helper to get seats for a booking
  const getSeatsForBooking = (booking: Booking): EventSeat[] => {
    return eventSeats.filter((seat) => booking.seats.includes(seat.id));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role={role} />

      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            My Bookings
          </h1>
          <p className="text-xl text-muted-foreground">
            View all your movie bookings
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => {
              const movie = booking.eventId;
              const schedule = booking.eventScheduleId;
              
              if (!movie || !schedule) return null;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="relative h-48">
                      <img
                        src={movie.image}
                        alt={movie.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="font-bold text-xl text-white">
                          {movie.name}
                        </h2>
                        <div className="flex items-center text-xs text-white/80 mt-1">
                          <Ticket className="h-3 w-3 mr-1" />
                          <span>Booking #{booking._id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.updatedAt), "MMMM d, yyyy")}{" "}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Seats</p>
                            <p className="text-sm text-muted-foreground">
                              {/* {seats
                                .map(
                                  (seat) =>
                                    `${seat.row}${seat.number} (${seat.seatType})`
                                )
                                .join(", ")} */}
                                {booking.row} - {booking.seatNo}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex justify-between">
                            <span className="font-medium">Total Paid:</span>
                            <span className="font-bold">
                              ${booking.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Film className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven't booked any movie tickets yet.
            </p>
            <Button asChild>
              <Link href="/movies">Browse Movies</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
