import { Composition } from 'remotion';
import { RedFlagVideo } from './videos/RedFlagVideo';
import { RedFlaqPromo } from './videos/RedFlaqPromo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="RedFlagVideo"
        component={RedFlagVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'Red Flag Detected',
          subtitle: 'Stay safe. Verify before you trust.',
          flagCount: 3,
        }}
      />
      <Composition
        id="RedFlaqPromo"
        component={RedFlaqPromo}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
