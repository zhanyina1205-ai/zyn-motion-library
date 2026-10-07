import {WanderingSpotlightDemo,spotlightDemoKeyframes} from './WanderingSpotlightDemo';
import {wanderingSpotlightDurationSeconds} from './motions';
import {FlipShineCardDemo} from './FlipShineCardDemo';
import {flipShineCardDurationSeconds} from './motions';
import {LayeredCollagePosterDemo} from './LayeredCollagePosterDemo';
import {TornPaperCloudWipeDemo} from './TornPaperCloudWipeDemo';
import {collagePosterLayers} from './CollagePosterArt';
import {layeredCollagePosterDurationSeconds,tornPaperCloudWipeDurationSeconds} from './motions';
import {CenterApertureFlashDemo} from './CenterApertureFlashDemo';
import {centerApertureFlashDurationSeconds} from './motions';
import {FoldPageAlbumDemo} from './FoldPageAlbumDemo';
import {foldPageAlbumDurationSeconds} from './motions';
import {MediaWindowCardDemo} from './MediaWindowCardDemo';
import {mediaWindowCardDurationSeconds} from './motions';
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
 <Composition id="MediaWindowCardDemo" component={MediaWindowCardDemo} width={1920} height={1080} fps={30} durationInFrames={113}
 defaultProps={{shrinkSeconds:0.55,settleSeconds:0.45,bounce:65}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(mediaWindowCardDurationSeconds(props)*30-1e-8)})}/>
 <Composition id="FoldPageAlbumDemo" component={FoldPageAlbumDemo} width={1920} height={1080} fps={30} durationInFrames={198}
 defaultProps={{turnSeconds:0.8,curlAngle:20,popupDepth:65}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(foldPageAlbumDurationSeconds(4,props)*30-1e-8)})}/>
 <Composition id="CenterApertureFlashDemo" component={CenterApertureFlashDemo} width={1920} height={1080} fps={30} durationInFrames={108}
 defaultProps={{shotSeconds:0.12,initialOpening:0}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(centerApertureFlashDurationSeconds(12,props)*30-1e-8)})}/>
 <Composition id="LayeredCollagePosterDemo" component={LayeredCollagePosterDemo} width={1920} height={1080} fps={30} durationInFrames={198}
 defaultProps={{pace:1,spinSpeed:65}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(layeredCollagePosterDurationSeconds(collagePosterLayers.map(l=>({...l,delaySeconds:(l.delaySeconds??0)*Number(props.pace??1),enterSeconds:(l.enterSeconds??.8)*Number(props.pace??1)})))*30-1e-8)})}/>
 <Composition id="TornPaperCloudWipeDemo" component={TornPaperCloudWipeDemo} width={1920} height={1080} fps={30} durationInFrames={126}
 defaultProps={{wipeSeconds:1.8,roughness:28,direction:'left'}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(tornPaperCloudWipeDurationSeconds(props)*30-1e-8)})}/>
 <Composition id="FlipShineCardDemo" component={FlipShineCardDemo} width={1920} height={1080} fps={30} durationInFrames={138}
 defaultProps={{flipSeconds:.4,direction:'left',shineEnabled:true,shineSeconds:.6,shineIntensity:.5}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(flipShineCardDurationSeconds(props)*30-1e-8)})}/>
 <Composition id="WanderingSpotlightDemo" component={WanderingSpotlightDemo} width={1920} height={1080} fps={30} durationInFrames={170}
 defaultProps={{pace:1,dimOpacity:.8,feather:0,captionSide:'top'}}
 calculateMetadata={({props})=>({durationInFrames:Math.ceil(wanderingSpotlightDurationSeconds(spotlightDemoKeyframes.map(k=>({...k,timeSeconds:k.timeSeconds*Number(props.pace??1)})))*30-1e-8)})}/>
</>;
