'use strict';
const shots=[...document.querySelectorAll('.shot')];
const formatTime=t=>`${Math.floor((Number.isFinite(t)?t:0)/60)}:${String(Math.floor((Number.isFinite(t)?t:0)%60)).padStart(2,'0')}`;
let toastTimer;
function toast(message){const box=document.getElementById('toast');box.textContent=message;box.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.hidden=true,2600);}
shots.forEach(shot=>{
 const video=shot.querySelector('video'),controls=shot.querySelector('.controls'),play=shot.querySelector('.play'),progress=shot.querySelector('.progress'),time=shot.querySelector('.time'),error=shot.querySelector('.video-error');
 video.controls=false;controls.hidden=false;
 const update=()=>{if(Number.isFinite(video.duration)){progress.max=video.duration;progress.value=video.currentTime;progress.setAttribute('aria-valuetext',`${video.currentTime.toFixed(1)} 秒，共 ${video.duration.toFixed(1)} 秒`);}time.textContent=`${formatTime(video.currentTime)} / ${formatTime(video.duration||Number(progress.max))}`;};
 const playVideo=()=>{error.hidden=true;video.play().catch(()=>toast('暂时无法播放，请再点一次播放。'));};
 play.addEventListener('click',()=>video.paused?playVideo():video.pause());
 shot.querySelector('.replay').addEventListener('click',()=>{video.currentTime=0;playVideo();});
 video.addEventListener('play',()=>{shots.forEach(other=>{if(other!==shot)other.querySelector('video').pause();});play.classList.add('playing');play.querySelector('.play-label').textContent='暂停';play.setAttribute('aria-label','暂停'+shot.querySelector('h2').textContent);});
 video.addEventListener('pause',()=>{play.classList.remove('playing');play.querySelector('.play-label').textContent='播放';play.setAttribute('aria-label','播放'+shot.querySelector('h2').textContent);});
 video.addEventListener('timeupdate',update);video.addEventListener('loadedmetadata',update);video.addEventListener('durationchange',update);
 video.addEventListener('error',()=>{error.hidden=false;});
 shot.querySelector('.retry').addEventListener('click',()=>{error.hidden=true;video.load();});
 progress.addEventListener('input',()=>{if(Number.isFinite(video.duration))video.currentTime=Number(progress.value);update();});
 shot.querySelector('.speed').addEventListener('change',e=>{video.playbackRate=Number(e.target.value);});
 shot.querySelector('.copy').addEventListener('click',async()=>{
  const text=shot.querySelector('code').textContent;
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);}else{const field=document.createElement('textarea');field.value=text;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const success=document.execCommand('copy');field.remove();if(!success)throw new Error('copy failed');}toast('参数已复制');}catch{toast('无法自动复制，可选中参数手动复制。');}
 });
 update();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)shots.forEach(shot=>shot.querySelector('video').pause());});
