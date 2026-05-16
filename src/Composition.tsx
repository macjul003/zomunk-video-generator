import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { SplashScreen } from "./screens/SplashScreen";
import { ListScreen } from "./screens/ListScreen";
import { DetailsScreen } from "./screens/DetailsScreen";
import { ClosingScreen } from "./screens/ClosingScreen";
import type { DealInput } from "./types/DealInput";

const springT = springTiming({ config: { damping: 200 } });

export const MyComposition: React.FC<DealInput> = (props) => (
  <AbsoluteFill style={{ background: "#fff" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <SplashScreen />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springT}
      />

      <TransitionSeries.Sequence durationInFrames={135}>
        <ListScreen {...props} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springT}
      />

      <TransitionSeries.Sequence durationInFrames={135}>
        <DetailsScreen {...props} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={springT} />

      <TransitionSeries.Sequence durationInFrames={90}>
        <ClosingScreen />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
