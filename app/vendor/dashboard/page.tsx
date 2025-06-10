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
import { Building2, CalendarCheck2, TicketCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Company } from "@/types";
import { useCompanyStore } from "@/lib/companies";
import { useEventScheduleStore } from "@/lib/eventSchedules";
import moment from "moment";

export default function VendorDashboard() {
  const { user } = useAuth();
  const { getCompanies, companies } = useCompanyStore();
  const { getEventSchedulesByVendor, schedulesByVendor: schedulesData } =
    useEventScheduleStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const getCompaniesData = async () => await getCompanies();
  const getSchedulesData = async () => await getEventSchedulesByVendor();
  const { schedules } = useEventScheduleStore();

  useEffect(() => {
    setIsClient(true);
    getCompaniesData();
    getSchedulesData();
  }, []);

  // Redirect if not vendor
  useEffect(() => {
    if (isClient && (!user || user.type !== "vendor")) {
      router.push("/login");
    }
  }, [user, router, isClient]);

  if (!isClient || !user || user.type !== "vendor") {
    return null; // Don't render anything while checking auth
  }

  // Mock values for stats
  const totalCustomers = 45;
  const totalBookings = 152;

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role="vendor" />

      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Vendor Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your theaters and movie schedules
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Theaters
                  </CardTitle>
                  <div className="p-2 rounded-full bg-indigo-500/10">
                    <Building2 className="h-4 w-4 text-indigo-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companies.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Scheduled Shows
                  </CardTitle>
                  <div className="p-2 rounded-full bg-amber-500/10">
                    <CalendarCheck2 className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schedules.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Customers
                  </CardTitle>
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <div className="p-2 rounded-full bg-emerald-500/10">
                    <TicketCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
            <CardHeader>
              <CardTitle>Your Theaters</CardTitle>
              <CardDescription>Manage your theater locations</CardDescription>
            </CardHeader>
            <CardContent>
              {companies.length > 0 ? (
                <ul className="space-y-4">
                  {companies.map((company) => (
                    <li
                      key={company.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-400 hover:scale-x-105 transition-all duration-300"
                    >
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {company.seats.reduce(
                            (total, seat) => total + seat.seatNo,
                            0
                          )}{" "}
                          total seats
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/vendor/company?id=${company._id}`)
                        }
                      >
                        Manage
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven't added any theaters yet.
                  </p>
                </div>
              )}
              <div className="mt-4">
                <Button
                  variant={companies.length > 0 ? "outline" : "default"}
                  className="w-full"
                  onClick={() => router.push("/vendor/company")}
                >
                  {companies.length > 0
                    ? "Add Another Theater"
                    : "Add Your First Theater"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
            <CardHeader>
              <CardTitle>Recent Schedules</CardTitle>
              <CardDescription>Your upcoming movie screenings</CardDescription>
            </CardHeader>
            <CardContent>
              {schedulesData.length > 0 ? (
                <ul className="space-y-4">
                  {schedulesData.slice(0, 5).map((schedule) => {
                    return (
                      <li
                        key={schedule._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-400 hover:scale-x-105 transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium">
                            {schedule?.eventId?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {schedule?.companyId?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {moment(schedule.date).format("MMMM Do YYYY")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/vendor/schedule?id=${schedule._id}`)
                          }
                        >
                          Details
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <CalendarCheck2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven't created any schedules yet.
                  </p>
                </div>
              )}
              <div className="mt-4">
                <Button
                  variant={schedules.length > 0 ? "outline" : "default"}
                  className="w-full"
                  onClick={() => router.push("/vendor/schedule")}
                >
                  {schedules.length > 0
                    ? "Schedule More Shows"
                    : "Create Your First Schedule"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
