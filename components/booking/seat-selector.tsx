"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventSeat } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronsDown, 
  ChevronsLeft, 
  ChevronsRight, 
  Info, 
  ScreenShare
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface SeatSelectorProps {
  seats: EventSeat[];
  selectedSeats: EventSeat[];
  onSelectSeat: (seat: EventSeat) => void;
  seatPrices: Record<string, number>;
}

export function SeatSelector({
  seats,
  selectedSeats,
  onSelectSeat,
  seatPrices,
}: SeatSelectorProps) {
  const [scale, setScale] = useState(1);
  
  // Group seats by type and row
  const seatsByType = seats.reduce<Record<string, Record<string, EventSeat[]>>>((acc, seat) => {
    if (!acc[seat.seatType]) {
      acc[seat.seatType] = {};
    }
    if (!acc[seat.seatType][seat.row]) {
      acc[seat.seatType][seat.row] = [];
    }
    acc[seat.seatType][seat.row].push(seat);
    return acc;
  }, {});

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.6));
  const resetZoom = () => setScale(1);

  const getSeatColor = (seatType: string) => {
    switch (seatType.toLowerCase()) {
      case 'standard': return 'bg-[hsl(var(--seat-standard))]';
      case 'premium': return 'bg-[hsl(var(--seat-premium))]';
      case 'vip': return 'bg-[hsl(var(--seat-vip))]';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 mb-12">
      {/* Screen */}
      <div className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[80%] h-8 bg-primary/20 rounded-t-full mb-1 flex items-center justify-center"
        >
          <ScreenShare className="h-4 w-4 text-primary/60" />
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-[90%] h-2 bg-primary/40 rounded-t-full mb-12"
        />
      </div>

      {/* Zoom controls */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={zoomOut}
          className="rounded-full h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetZoom}
          className="rounded-full h-8"
        >
          Reset
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={zoomIn}
          className="rounded-full h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
        {Object.keys(seatsByType).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn("w-4 h-4 rounded", getSeatColor(type))}></div>
            <span>{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Seat Map px-4 md:mx-32 with zoom */}
      <div 
        className="w-full overflow-x-auto pb-4"
        style={{ 
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <motion.div 
          className="flex flex-col items-center min-w-max"
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Seat Map */}
          <div className="space-y-8">
            {Object.entries(seatsByType).map(([seatType, rows], typeIndex) => (
              <div key={seatType} className="space-y-4">
                <div className="text-center font-semibold">{seatType}</div>
                <div className="flex flex-col gap-2 p-4 bg-card/40 rounded-lg backdrop-blur-sm border border-border/50 shadow-md">
                  {Object.entries(rows).map(([row, seats]) => (
                    <div key={row} className="flex items-center gap-2">
                      <div className="w-6 text-center font-medium text-muted-foreground">
                        {row}
                      </div>
                      <div className="flex gap-2">
                        {seats
                          .sort((a, b) => a.number - b.number)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            const isBooked = seat.status === "booked";
                            
                            return (
                              <TooltipProvider key={seat.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <motion.button
                                      disabled={isBooked}
                                      onClick={() => onSelectSeat(seat)}
                                      className={cn(
                                        "w-8 h-8 rounded-t-lg text-xs transition-all relative select-none",
                                        isBooked 
                                          ? "bg-muted text-muted-foreground cursor-not-allowed" 
                                          : isSelected
                                          ? `${getSeatColor(seatType)} text-white`
                                          : `${getSeatColor(seatType)}/20 hover:${getSeatColor(seatType)}/40`
                                      )}
                                      whileHover={!isBooked ? { y: -4 } : {}}
                                      whileTap={!isBooked ? { scale: 0.95 } : {}}
                                      layout
                                    >
                                      {seat.number}
                                      <motion.div 
                                        className={cn(
                                          "absolute bottom-0 left-0 right-0 h-1 rounded-b-lg",
                                          getSeatColor(seatType)
                                        )}
                                        layoutId={`seat-base-${seat.id}`}
                                      />
                                    </motion.button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <div className="text-xs">
                                      <div className="font-semibold">{seatType}</div>
                                      <div>${seatPrices[seatType] || '?'}</div>
                                      <div>{isBooked ? 'Booked' : 'Available'}</div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
                {typeIndex < Object.keys(seatsByType).length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
        <Info className="h-4 w-4" /> 
        <span>Scroll horizontally to see more seats if needed</span>
      </div>

      {/* Selected Seats Summary */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 p-4 rounded-lg bg-card border border-border w-full max-w-md"
          >
            <h3 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <motion.div
                  key={seat.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md border flex items-center gap-1",
                    getSeatColor(seat.seatType),
                    "text-white"
                  )}
                >
                  <span>
                    {seat.row}-{seat.number} ({seat.seatType})
                  </span>
                  <span className="font-medium">${seatPrices[seat.seatType] || '?'}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-medium">
              <span>Total:</span>
              <span>
                $
                {selectedSeats.reduce(
                  (sum, seat) => sum + (seatPrices[seat.seatType] || 0),
                  0
                ).toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}