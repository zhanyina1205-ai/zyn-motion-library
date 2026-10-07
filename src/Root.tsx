import {Composition} from 'remotion';
import {WholePageSlideDemo,FloatingPolaroidsDemo} from './Demos';
import {PerspectiveCarouselDemo} from './PerspectiveCarouselDemo';
import {carouselDurationSeconds} from './motions';
export const MotionLibraryRoot=()=> <>
 <Composition id="WholePageSlideDemo" component={WholePageSlideDemo} width={1920} height={1080} fps={30} durationInFrames={195}/>
 <Composition id="FloatingPolaroidsDemo" component={FloatingPolaroidsDemo} width={1920} height={1080} fps={30} durationInFrames={210}/>
 <Composition id="PerspectiveCarouselDemo" component={PerspectiveCarouselDemo} width={1920} height={1080} fps={30} durationInFrames={138}
   defaultProps={{direction: 'left', turnSeconds: 0.6, holdSeconds: 0.5, radius: 635, perspective: 2200}}
   calculateMetadata={({props}) => ({durationInFrames: Math.ceil(carouselDurationSeconds(props) * 30 - 1e-8)})}/>
</>;
