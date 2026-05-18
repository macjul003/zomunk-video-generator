export interface DealInput {
  destinationImageUrl: string; // blob: URL (live preview) or /uploads/<id>.jpg (render)
  destination: string;         // "Casablanca"
  country: string;             // "Morocco"
  departure: string;           // "New Delhi"
  price: string;               // "₹98,240"
  originalPrice: string;       // "₹1,28,298"
  months: string;              // "Jan, Feb"
  stops: string;               // "direct" | "1 stop" | "2 stops"
  travelClass: string;         // "Economy" | "Business" | "First"
  travelPeriod: string;        // "Sept – Dec 2024"
  airlineLogoUrl: string;      // blob: URL, /uploads/<id>.png, or /airline-air-india.png
  airlineName: string;         // "Air India"
}
