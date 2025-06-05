"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { MainNav } from "@/components/layout/main-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, Mail, Phone, Calendar, Shield } from "lucide-react";
import { useUserStore } from "@/lib/users";

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { getUsers } = useUserStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (isClient && (!user || user.type !== "admin")) {
      router.push("/login");
    }
  }, [user, router, isClient]);

  const getUsersData = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  // Fetch users
  useEffect(() => {
    if (user?.type === "admin") {
      // In a real app, this would be an API call
      // const mockUsers = [
      //   {
      //     id: '1',
      //     name: 'Admin User',
      //     email: 'admin@example.com',
      //     phone: '1234567890',
      //     type: 'admin',
      //     createdAt: new Date().toISOString(),
      //   },
      //   {
      //     id: '2',
      //     name: 'Vendor User',
      //     email: 'vendor@example.com',
      //     phone: '2345678901',
      //     type: 'vendor',
      //     createdAt: new Date().toISOString(),
      //   },
      //   {
      //     id: '3',
      //     name: 'Regular User',
      //     email: 'user@example.com',
      //     phone: '3456789012',
      //     type: 'user',
      //     createdAt: new Date().toISOString(),
      //   },
      // ] as User[];
      getUsersData();
    }
  }, []);

  if (!isClient || !user || user.type !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role="admin" />

      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Users Management
          </h1>
          <p className="text-xl text-muted-foreground">
            View and manage all users in the system
          </p>
        </div>

        <div className="grid gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined {format(new Date(user.createdAt), "PP")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Badge
                          variant={
                            user.type === "admin"
                              ? "destructive"
                              : user.type === "vendor"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.type.charAt(0).toUpperCase() +
                            user.type.slice(1)}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
