import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { staticFile } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ZomunkReel"
        component={MyComposition as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={465}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          destinationImageUrl: staticFile("images/figma-casablanca.png"),
          destination: "Casablanca",
          country: "Morocco",
          departure: "New Delhi",
          price: "₹98,240",
          originalPrice: "₹1,28,298",
          months: "Jan, Mar - Jun",
          stops: "1 stop",
          travelClass: "Economy",
          travelPeriod: "Sept – Dec 2026",
          airlineLogoUrl: staticFile("images/airline-air-india.png"),
          airlineName: "Emirates",
          userCountry: "India",
          userCountryCode: "IN",
        }}
      />
    </>
  );
};
