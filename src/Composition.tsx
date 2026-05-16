import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { flip } from "@remotion/transitions/flip";
import { wipe } from "@remotion/transitions/wipe";
import { SplashScreen } from "./screens/SplashScreen";
import { ListScreen } from "./screens/ListScreen";
import { DetailsScreen } from "./screens/DetailsScreen";
import { ClosingScreen } from "./screens/ClosingScreen";
import { PhoneFrame, PHONE_CORNER_R } from "./components/PhoneFrame";
import type { DealInput } from "./types/DealInput";

// Looser spring = slight bounce, feels like a real device gesture
const springT = springTiming({ config: { damping: 26, stiffness: 170 } });

export const MyComposition: React.FC<DealInput> = (props) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a0d2e 0%, #0d0d0d 100%)" }}>
    {/* Screen content clipped to phone screen shape */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: PHONE_CORNER_R,
        overflow: "hidden",
      }}
    >
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <SplashScreen />
        </TransitionSeries.Sequence>

        {/* Natural page push: Splash → List */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springT}
        />

        <TransitionSeries.Sequence durationInFrames={135}>
          <ListScreen {...props} />
        </TransitionSeries.Sequence>

        {/* Flip: tapping a card open, List → Details */}
        <TransitionSeries.Transition
          presentation={flip({ direction: "from-right" })}
          timing={springT}
        />

        <TransitionSeries.Sequence durationInFrames={135}>
          <DetailsScreen {...props} />
        </TransitionSeries.Sequence>

        {/* Wipe from top: elegant curtain reveal, Details → Closing */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-top" })}
          timing={springT}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <ClosingScreen />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </div>

    {/* Phone bezel + Dynamic Island — drawn above all content */}
    <PhoneFrame />
  </AbsoluteFill>
);
