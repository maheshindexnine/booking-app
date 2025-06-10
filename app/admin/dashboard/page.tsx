"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useMovieStore } from "@/lib/movies";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Users, Ticket, Building2, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { movies } = useMovieStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
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
    return null; // Don't render anything while checking auth
  }

  const totalUsers = 3; // Mock user count for demo
  const totalMovies = movies.length;
  const totalSchedules = 5;
  const totalBookings = 6;

  const statCards = [
    { title: "Total Users", value: totalUsers, icon: Users, color: "bg-blue-500" },
    { title: "Movies", value: totalMovies, icon: Film, color: "bg-purple-500" },
    { title: "Schedules", value: totalSchedules, icon: Building2, color: "bg-amber-500" },
    { title: "Bookings", value: totalBookings, icon: Ticket, color: "bg-emerald-500" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role="admin" />
      
      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor and manage your movie booking platform
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${card.color}/10`}>
                      <card.icon className={`h-4 w-4 text-${card.color.split('-')[1]}-500`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
            <CardHeader>
              <CardTitle>Recent Movies</CardTitle>
              <CardDescription>Recently added movies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {movies.slice(0, 5).map((movie) => (
                  <li key={movie.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <img src={movie.image} alt={movie.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{movie.name}</p>
                      <p className="text-xs text-muted-foreground">{movie.genre.join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => router.push('/admin/movies')}>
                  View All Movies
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Platform overview</CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-primary mr-2"></div>
                      <span>Movie Distribution</span>
                    </div>
                    <span className="font-medium">{totalMovies}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div 
                      className="h-2 rounded-full bg-primary" 
                      style={{ width: `${(totalMovies / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
                      <span>Schedules</span>
                    </div>
                    <span className="font-medium">{totalSchedules}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div 
                      className="h-2 rounded-full bg-amber-500" 
                      style={{ width: `${(totalSchedules / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 mr-2"></div>
                      <span>Bookings</span>
                    </div>
                    <span className="font-medium">{totalBookings}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div 
                      className="h-2 rounded-full bg-emerald-500" 
                      style={{ width: `${(totalBookings / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}