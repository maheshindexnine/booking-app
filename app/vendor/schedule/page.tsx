"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useMovieStore } from "@/lib/movies";
import { MainNav } from "@/components/layout/main-nav";
import { Company, Movie } from "@/types";
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
import { useCompanyStore } from "@/lib/companies";
import { useEventScheduleStore } from "@/lib/eventSchedules";
import moment from "moment";

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { getCompaniesByUserId, getMovies, schedules, movies } =
    useMovieStore();
  const { createSchedule } = useEventScheduleStore();
  const { getCompanies, companies, getCompanyById } = useCompanyStore();
  const { schedules: schedulesData } = useEventScheduleStore();
  const [isClient, setIsClient] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [date, setDate] = useState("");
  const [seatTypes, setSeatTypes] = useState<
    { name: string; price: number; capacity: number }[]
  >([]);

  // Add effect to handle company selection
  useEffect(() => {
    setSeatTypes([]);
    const fetchCompanySeats = async () => {
      if (selectedCompany) {
        const company = await getCompanyById(selectedCompany);
        if (company && company.seats) {
          // Map the seats to the required format
          const formattedSeats = company.seats.map((seat) => ({
            name: seat.name,
            price: seat.price || 0,
            capacity: seat.capacity,
          }));
          setSeatTypes(formattedSeats);
        }
      } else {
        setSeatTypes([]);
      }
    };

    fetchCompanySeats();
  }, [selectedCompany, getCompanyById]);

  const getMoviesData = async () => {
    await getMovies();
  };

  const getCompaniesData = async () => {
    await getCompanies();
  };

  useEffect(() => {
    setIsClient(true);
    getMoviesData();
    getCompaniesData();
  }, []);

  // Redirect if not vendor
  useEffect(() => {
    if (isClient && (!user || user.type !== "vendor")) {
      router.push("/login");
    }
  }, [user, router, isClient]);

  if (!isClient || !user || user.type !== "vendor") {
    return null;
  }

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

  const handleSubmit = () => {
    if (!selectedCompany || !selectedMovie || !date || seatTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      createSchedule({
        userId: user.id,
        companyId: selectedCompany,
        eventId: selectedMovie,
        date,
        seatTypes,
      });

      toast({
        title: "Schedule Created",
        description: "New movie schedule has been created successfully",
      });

      router.push(`/vendor/dashboard`);

      // Reset form
      setSelectedCompany("");
      setSelectedMovie("");
      setDate("");
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
                    onValueChange={(value: string) => setSelectedCompany(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theater" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies
                        .filter(
                          (
                            company: Company
                          ): company is Company & { _id: string } =>
                            Boolean(company._id)
                        )
                        .map((company) => (
                          <SelectItem key={company._id} value={company._id}>
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
                      {movies
                        .filter(
                          (movie: Movie): movie is Movie & { _id: string } =>
                            Boolean(movie._id)
                        )
                        .map((movie) => (
                          <SelectItem key={movie._id} value={movie._id}>
                            {movie.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div> */}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Seat Types</Label>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSeatType}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Type
                    </Button> */}
                  </div>
                  {!seatTypes.length && (
                    <p className="text-muted-foreground">
                      Select theater for seats
                    </p>
                  )}
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
                          disabled={true}
                          placeholder="e.g., VIP"
                        />
                      </div>
                      <div>
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
                          disabled={true}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Price ($)</Label>
                          <Input
                            type="number"
                            value={seatType.price}
                            onChange={(e) =>
                              handleSeatTypeChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSeatType(index)}
                          className="h-10 w-10 shrink-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button> */}
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
                {schedulesData.length > 0 ? (
                  <div className="space-y-4">
                    {schedulesData.map((schedule) => {
                      return (
                        <motion.div
                          key={schedule._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-red-400 hover:scale-x-105 transition-all duration-300"
                        >
                          <div>
                            <p className="font-medium">
                              {schedule?.eventId?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {schedule?.companyId?.name}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <CalendarCheck2 className="h-4 w-4 mr-1" />
                              <span>
                                {moment(schedule.date).format("MMMM Do YYYY")}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/vendor/schedule?id=${schedule._id}`)
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
