"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarCheck2, Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { getCompaniesByUserId, getMovies, schedules, addSchedule, movies } =
    useMovieStore();

  const [isClient, setIsClient] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seatTypes, setSeatTypes] = useState<
    { name: string; price: number; capacity: number }[]
  >([]);

  // Redirect if not vendor
  useEffect(() => {
    if (isClient && (!user || user.type !== "vendor")) {
      router.push("/login");
    }
  }, [user, router, isClient]);

  if (!isClient || !user || user.type !== "vendor") {
    return null;
  }

  const companies = getCompaniesByUserId(user.id);
  // const movies = getMovies();
  const vendorSchedules = schedules.filter(
    (schedule) => schedule.userId === user.id
  );

  const handleAddSeatType = () => {
    setSeatTypes([...seatTypes, { name: "", price: 0, capacity: 0 }]);
  };

  const handleRemoveSeatType = (index: number) => {
    setSeatTypes(seatTypes.filter((_, i) => i !== index));
  };

  const handleSeatTypeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newSeatTypes = [...seatTypes];
    newSeatTypes[index] = {
      ...newSeatTypes[index],
      [field]: field === "name" ? value : Number(value),
    };
    setSeatTypes(newSeatTypes);
  };

  const getMoviesData = async () => {
    await getMovies();
  };

  const handleSubmit = () => {
    if (
      !selectedCompany ||
      !selectedMovie ||
      !date ||
      !time ||
      seatTypes.length === 0
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      addSchedule({
        userId: user.id,
        companyId: selectedCompany,
        eventId: selectedMovie,
        date,
        time,
        seatTypes,
      });

      toast({
        title: "Schedule Created",
        description: "New movie schedule has been created successfully",
      });

      // Reset form
      setSelectedCompany("");
      setSelectedMovie("");
      setDate("");
      setTime("");
      setSeatTypes([]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create schedule",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setIsClient(true);
    getMoviesData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role="vendor" />

      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Movie Schedules
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your movie schedules and showtimes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Schedule Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Create New Schedule</CardTitle>
                <CardDescription>Set up a new movie showtime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Theater</Label>
                  <Select
                    value={selectedCompany}
                    onValueChange={setSelectedCompany}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theater" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="movie">Movie</Label>
                  <Select
                    value={selectedMovie}
                    onValueChange={setSelectedMovie}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select movie" />
                    </SelectTrigger>
                    <SelectContent>
                      {movies.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id}>
                          {movie.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Seat Types</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSeatType}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Type
                    </Button>
                  </div>

                  {seatTypes.map((seatType, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-3 gap-2 items-end"
                    >
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={seatType.name}
                          onChange={(e) =>
                            handleSeatTypeChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., VIP"
                        />
                      </div>
                      <div>
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          value={seatType.price}
                          onChange={(e) =>
                            handleSeatTypeChange(index, "price", e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Capacity</Label>
                          <Input
                            type="number"
                            value={seatType.capacity}
                            onChange={(e) =>
                              handleSeatTypeChange(
                                index,
                                "capacity",
                                e.target.value
                              )
                            }
                            min="1"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSeatType(index)}
                          className="h-10 w-10 shrink-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Create Schedule
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Existing Schedules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Current Schedules</CardTitle>
                <CardDescription>Your active movie schedules</CardDescription>
              </CardHeader>
              <CardContent>
                {vendorSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {vendorSchedules.map((schedule) => {
                      const movie = movies.find(
                        (m) => m.id === schedule.eventId
                      );
                      const company = companies.find(
                        (c) => c.id === schedule.companyId
                      );

                      return (
                        <motion.div
                          key={schedule.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{movie?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {company?.name}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <CalendarCheck2 className="h-4 w-4 mr-1" />
                              <span>
                                {schedule.date} at {schedule.time}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/vendor/schedule?id=${schedule.id}`)
                            }
                          >
                            View Details
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarCheck2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      No schedules created yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
