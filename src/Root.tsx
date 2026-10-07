import {Composition} from 'remotion';
import {WholePageSlideDemo,FloatingPolaroidsDemo} from './Demos';
export const MotionLibraryRoot=()=> <>
 <Composition id="WholePageSlideDemo" component={WholePageSlideDemo} width={1920} height={1080} fps={30} durationInFrames={195}/>
 <Composition id="FloatingPolaroidsDemo" component={FloatingPolaroidsDemo} width={1920} height={1080} fps={30} durationInFrames={210}/>
</>;
