export interface DealInput {
  destinationImageUrl: string; // blob: URL (live preview) or /uploads/<id>.jpg (render)
  destination: string;         // "Casablanca"
  departure: string;           // "New Delhi"
  price: string;               // "₹98,240"
  originalPrice: string;       // "₹1,28,298"
  months: string;              // "Jan, Feb"
}
