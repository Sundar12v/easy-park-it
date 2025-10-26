import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Clock, IndianRupee, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QRCode from "react-qr-code";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingData = location.state || {
    parkingLot: "Demo Parking",
    location: "Demo Location",
    slotId: "F1-1",
    duration: 2,
    totalCost: 100,
  };

  const bookingId = `BK${Date.now().toString().slice(-8)}`;
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + bookingData.duration * 60 * 60 * 1000);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <div className="bg-gradient-accent text-accent-foreground py-12 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg opacity-90">
            Your parking slot has been reserved successfully
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl py-8 px-4">
        {/* Booking Details Card */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{bookingData.parkingLot}</h2>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{bookingData.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Booking ID</div>
              <div className="font-mono font-bold text-primary">{bookingId}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Slot Number</div>
              <div className="text-2xl font-bold">{bookingData.slotId}</div>
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Total Cost</div>
              <div className="text-2xl font-bold flex items-center gap-1 text-primary">
                <IndianRupee className="w-5 h-5" />
                {bookingData.totalCost}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Booking Date</div>
                <div className="font-semibold">{formatDate(startTime)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Parking Time</div>
                <div className="font-semibold">
                  {formatTime(startTime)} - {formatTime(endTime)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ({bookingData.duration} {bookingData.duration === 1 ? "hour" : "hours"})
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-t pt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold mb-2">Entry QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Show this QR code at the parking entrance
              </p>
            </div>
            
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <QRCode
                value={JSON.stringify({
                  bookingId,
                  parkingLot: bookingData.parkingLot,
                  slotId: bookingData.slotId,
                  startTime: startTime.toISOString(),
                  endTime: endTime.toISOString(),
                })}
                size={200}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-gradient-primary hover:opacity-90"
            onClick={() => navigate("/")}
          >
            Book Another Slot
          </Button>
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-6 bg-secondary/50">
          <h3 className="font-bold mb-3">Important Instructions:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>Please arrive within 15 minutes of your booking start time</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Show the QR code at the entry gate for automatic barrier opening</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Your slot number is {bookingData.slotId} - look for the digital display boards</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Additional charges apply for overtime parking at ₹{bookingData.totalCost / bookingData.duration}/hour</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Confirmation;
