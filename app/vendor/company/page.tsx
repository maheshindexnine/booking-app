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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStore } from "@/lib/companies";
import { UserRole } from "@/types";

export default function CompanyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const companyId = searchParams.get("id");

  const {
    addCompany: addCompanyToCompanyStore,
    updateCompany: updateCompanyToCompanyStore,
    getCompanyById: getCompanyByIdFromCompanyStore,
  } = useCompanyStore();

  const [isClient, setIsClient] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [seats, setSeats] = useState<
    { name: string; capacity: number; color: string }[]
  >([{ name: "", capacity: 0, color: "blue-500" }]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log(companyId, " eeffef asd kas");

    if (companyId) {
      const company = getCompanyByIdFromCompanyStore(companyId);
      if (company) {
        setCompanyName(company.name);
        setSeats(company.seats as any);
      }
    }
  }, [companyId, getCompanyByIdFromCompanyStore]);

  // Redirect if not vendor
  useEffect(() => {
    if (isClient && (!user || user.type !== "vendor")) {
      router.push("/login");
    }
  }, [user, router, isClient]);

  if (!isClient || !user || user.type !== "vendor") {
    return null;
  }

  const handleAddSeatType = () => {
    setSeats([...seats, { name: "", capacity: 0, color: "blue-500" }]);
  };

  const handleRemoveSeatType = (index: number) => {
    setSeats(seats.filter((_, i) => i !== index));
  };

  const handleSeatChange = (
    index: number,
    field: "name" | "capacity" | "color",
    value: string
  ) => {
    const newSeats = [...seats];
    newSeats[index] = {
      ...newSeats[index],
      [field]:
        field === "capacity"
          ? parseInt(value) || 0
          : field === "color"
          ? value
          : value,
    };
    setSeats(newSeats);
  };

  const handleSubmit = () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    if (seats.some((seat) => !seat.name.trim() || seat.capacity <= 0)) {
      toast({
        title: "Error",
        description: "Please fill in all seat types with valid capacities",
        variant: "destructive",
      });
      return;
    }

    try {
      if (companyId) {
        updateCompanyToCompanyStore(companyId, {
          _id: companyId,
          userId: user.userId,
          name: companyName,
          seats: seats as any,
        });
        toast({
          title: "Success",
          description: "Theater updated successfully",
        });
      } else {
        addCompanyToCompanyStore({
          _id: "",
          userId: user.userId,
          name: companyName,
          seats: seats as any,
        });
        toast({
          title: "Success",
          description: "Theater added successfully",
        });
      }
      router.push("/vendor/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theater",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav role={user.type as UserRole} />

      <div className="px-4 md:mx-32 py-8">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            {companyId ? "Edit Theater" : "Add New Theater"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {companyId
              ? "Update your theater details"
              : "Set up a new theater location"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto bg-card/60 backdrop-blur-sm border-2 border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Theater Details</CardTitle>
              <CardDescription>
                Enter your theater information and configure seating options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Theater Name</Label>
                <Input
                  id="name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter theater name"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Seat Types</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSeatType}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Type
                  </Button>
                </div>

                <div className="space-y-4">
                  {seats.map((seat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="flex-1">
                        <Label htmlFor={`seat-name-${index}`}>Type Name</Label>
                        <Input
                          id={`seat-name-${index}`}
                          value={seat.name}
                          onChange={(e) =>
                            handleSeatChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Standard, VIP"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`seat-color-${index}`}>Color</Label>
                        <select
                          id={`seat-color-${index}`}
                          value={seat.color}
                          onChange={(e) =>
                            handleSeatChange(index, "color", e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="blue-500" className="bg-blue-500">
                            Standard (Blue)
                          </option>
                          <option value="purple-500" className="bg-purple-500">
                            Premium (Purple)
                          </option>
                          <option value="yellow-500" className="bg-yellow-500">
                            VIP (Yellow)
                          </option>
                          <option value="pink-500" className="bg-pink-500">
                            Deluxe (Pink)
                          </option>
                          <option value="green-500" className="bg-green-500">
                            Executive (Green)
                          </option>
                          <option value="red-500" className="bg-red-500">
                            Royal (Red)
                          </option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`seat-capacity-${index}`}>
                          Capacity
                        </Label>
                        <Input
                          id={`seat-capacity-${index}`}
                          type="number"
                          value={seat.capacity}
                          onChange={(e) =>
                            handleSeatChange(index, "capacity", e.target.value)
                          }
                          min="1"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => handleRemoveSeatType(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/vendor/dashboard")}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  <Building2 className="h-4 w-4" />
                  {companyId ? "Update Theater" : "Add Theater"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
