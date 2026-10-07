import {ThumbnailPanelDemo} from './ThumbnailPanelDemo';
import {ChromaticGlitchDemo} from './ChromaticGlitchDemo';
import {thumbnailPanelDurationSeconds,chromaticGlitchDurationSeconds} from './motions';
import {Composition} from 'remotion';
import {WholePageSlideDemo,FloatingPolaroidsDemo} from './Demos';
import {PerspectiveCarouselDemo} from './PerspectiveCarouselDemo';
import {carouselDurationSeconds} from './motions';
import {FlipCardStackDemo} from './FlipCardStackDemo';
import {StickerSwapDemo} from './StickerSwapDemo';
import {flipStackDurationSeconds, stickerSwapDurationSeconds} from './motions';
export const MotionLibraryRoot=()=> <>
 <Composition id="WholePageSlideDemo" component={WholePageSlideDemo} width={1920} height={1080} fps={30} durationInFrames={195}/>
 <Composition id="FloatingPolaroidsDemo" component={FloatingPolaroidsDemo} width={1920} height={1080} fps={30} durationInFrames={210}/>
 <Composition id="PerspectiveCarouselDemo" component={PerspectiveCarouselDemo} width={1920} height={1080} fps={30} durationInFrames={138}
   defaultProps={{direction: 'left', turnSeconds: 0.6, holdSeconds: 0.5, radius: 635, perspective: 2200}}
   calculateMetadata={({props}) => ({durationInFrames: Math.ceil(carouselDurationSeconds(props) * 30 - 1e-8)})}/>
 <Composition id="FlipCardStackDemo" component={FlipCardStackDemo} width={1920} height={1080} fps={30} durationInFrames={120}
   defaultProps={{stepSeconds: 0.1, spread: 52, flipAngle: 65, bend: 20}}
   calculateMetadata={({props}) => ({durationInFrames: Math.ceil(flipStackDurationSeconds(10, {...props, startIndex: 2}) * 30 - 1e-8)})}/>
 <Composition id="StickerSwapDemo" component={StickerSwapDemo} width={1920} height={1080} fps={30} durationInFrames={174}
   defaultProps={{itemSeconds: 0.35, outline: 5, drift: 0}}
   calculateMetadata={({props}) => ({durationInFrames: Math.ceil(stickerSwapDurationSeconds(Array.from({length:12}, () => Number(props.itemSeconds ?? 0.35))) * 30 - 1e-8)})}/>
 <Composition id="ThumbnailPanelDemo" component={ThumbnailPanelDemo} width={1920} height={1080} fps={30} durationInFrames={110}
 defaultProps={{expandSeconds:0.55,staggerSeconds:0.12,drop:30}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(thumbnailPanelDurationSeconds(4,props)*30-1e-8)})}/>
 <Composition id="ChromaticGlitchDemo" component={ChromaticGlitchDemo} width={1920} height={1080} fps={30} durationInFrames={96}
 defaultProps={{transitionSeconds:0.9,split:22,sliceShift:30}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(chromaticGlitchDurationSeconds(props)*30-1e-8)})}/>
</>;
