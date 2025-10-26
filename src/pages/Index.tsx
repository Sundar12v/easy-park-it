import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, IndianRupee, Car, Bike, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for parking lots
const parkingLots = [
  {
    id: 1,
    name: "Central Plaza Parking",
    location: "Connaught Place, New Delhi",
    distance: "0.5 km",
    pricePerHour: 50,
    availableSlots: 24,
    totalSlots: 100,
    vehicleTypes: ["car", "bike", "ev"],
  },
  {
    id: 2,
    name: "Metro Station Parking",
    location: "Rajiv Chowk Metro, Delhi",
    distance: "1.2 km",
    pricePerHour: 40,
    availableSlots: 45,
    totalSlots: 150,
    vehicleTypes: ["car", "bike"],
  },
  {
    id: 3,
    name: "Mall Parking Complex",
    location: "Select Citywalk, Saket",
    distance: "2.8 km",
    pricePerHour: 60,
    availableSlots: 67,
    totalSlots: 200,
    vehicleTypes: ["car", "bike", "ev"],
  },
  {
    id: 4,
    name: "Airport Parking Hub",
    location: "IGI Airport, Terminal 3",
    distance: "15 km",
    pricePerHour: 80,
    availableSlots: 120,
    totalSlots: 300,
    vehicleTypes: ["car", "bike", "ev"],
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLots = parkingLots.filter(
    (lot) =>
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "success";
    if (percentage > 20) return "warning";
    return "destructive";
  };

  const vehicleIcons = {
    car: Car,
    bike: Bike,
    ev: Zap,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Smart Parking Made Easy
          </h1>
          <p className="text-lg md:text-xl text-center mb-8 opacity-90">
            Book your parking slot in seconds, just like booking a movie ticket
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-card rounded-xl p-2 shadow-card">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location or parking name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Parking Lots Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Available Parking Lots
            </h2>
            <p className="text-muted-foreground">
              {filteredLots.length} parking lots near you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLots.map((lot) => (
              <Card
                key={lot.id}
                className="p-6 hover:shadow-card transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                onClick={() => navigate(`/booking/${lot.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{lot.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{lot.location}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-secondary">
                    {lot.distance}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Price:</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-lg">
                      <IndianRupee className="w-4 h-4" />
                      <span>{lot.pricePerHour}/hr</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Availability:
                    </span>
                    <Badge variant={getAvailabilityColor(lot.availableSlots, lot.totalSlots)}>
                      {lot.availableSlots}/{lot.totalSlots} slots
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Vehicle Types:
                    </span>
                    <div className="flex gap-2">
                      {lot.vehicleTypes.map((type) => {
                        const Icon = vehicleIcons[type as keyof typeof vehicleIcons];
                        return (
                          <div
                            key={type}
                            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                            title={type}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  View & Book Slots
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
