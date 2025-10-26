import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Bike, Zap, Clock, IndianRupee, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock parking lot data
const parkingLotData = {
  1: {
    id: 1,
    name: "Central Plaza Parking",
    location: "Connaught Place, New Delhi",
    pricePerHour: 50,
    floors: [
      {
        id: "F1",
        name: "Floor 1",
        slots: Array.from({ length: 40 }, (_, i) => ({
          id: `F1-${i + 1}`,
          number: i + 1,
          type: i % 3 === 0 ? "ev" : i % 2 === 0 ? "bike" : "car",
          status: Math.random() > 0.3 ? "available" : "booked",
        })),
      },
      {
        id: "F2",
        name: "Floor 2",
        slots: Array.from({ length: 40 }, (_, i) => ({
          id: `F2-${i + 1}`,
          number: i + 1,
          type: i % 3 === 0 ? "ev" : i % 2 === 0 ? "bike" : "car",
          status: Math.random() > 0.5 ? "available" : "booked",
        })),
      },
    ],
  },
};

type SlotStatus = "available" | "booked" | "selected";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState("F1");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState("2");

  const parkingLot = parkingLotData[1]; // For demo, using lot 1
  const currentFloor = parkingLot.floors.find((f) => f.id === selectedFloor);

  const handleSlotClick = (slotId: string, status: string) => {
    if (status === "booked") {
      toast.error("This slot is already booked");
      return;
    }
    setSelectedSlot(slotId === selectedSlot ? null : slotId);
  };

  const getSlotClassName = (status: string, slotId: string) => {
    const isSelected = slotId === selectedSlot;
    
    if (isSelected) {
      return "bg-selected text-selected-foreground border-selected hover:bg-selected/90";
    }
    
    if (status === "booked") {
      return "bg-destructive/20 text-destructive border-destructive cursor-not-allowed";
    }
    
    return "bg-success/20 text-success border-success hover:bg-success/30 cursor-pointer";
  };

  const vehicleIcons = {
    car: Car,
    bike: Bike,
    ev: Zap,
  };

  const totalCost = selectedSlot ? parkingLot.pricePerHour * parseInt(duration) : 0;

  const handleProceedToBooking = () => {
    if (!selectedSlot) {
      toast.error("Please select a parking slot");
      return;
    }
    navigate("/confirmation", {
      state: {
        parkingLot: parkingLot.name,
        location: parkingLot.location,
        slotId: selectedSlot,
        duration: parseInt(duration),
        totalCost,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {parkingLot.name}
              </h1>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <MapPin className="w-4 h-4" />
                <span>{parkingLot.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm opacity-90">Price per hour</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {parkingLot.pricePerHour}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Slot Selection Area */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold">Select Your Parking Slot</h2>
                
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingLot.floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-success bg-success/20"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-destructive bg-destructive/20"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border-2 border-selected bg-selected"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>

              {/* Slot Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {currentFloor?.slots.map((slot) => {
                  const Icon = vehicleIcons[slot.type as keyof typeof vehicleIcons];
                  return (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot.id, slot.status)}
                      className={`
                        aspect-square rounded-lg border-2 p-1
                        flex flex-col items-center justify-center
                        transition-all duration-200
                        ${getSlotClassName(slot.status, slot.id)}
                      `}
                      disabled={slot.status === "booked"}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-xs font-semibold">{slot.number}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Selected Slot</div>
                  <div className="text-lg font-bold">
                    {selectedSlot || "No slot selected"}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Duration
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((hrs) => (
                        <SelectItem key={hrs} value={hrs.toString()}>
                          {hrs} {hrs === 1 ? "hour" : "hours"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Rate/hour</span>
                    <span className="font-semibold flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {parkingLot.pricePerHour}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{duration}h</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                    <span>Total Cost</span>
                    <span className="flex items-center gap-1 text-primary">
                      <IndianRupee className="w-5 h-5" />
                      {totalCost}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
                onClick={handleProceedToBooking}
                disabled={!selectedSlot}
              >
                Proceed to Book
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
