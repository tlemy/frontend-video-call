<div class="room">
    <h1>Room #</h1>
    <div id="others">

    </div>
    <div id="self">
        <div id="no-camera" style="{!isVideoPaused ? "display: none" : ""}">
            No camera
        </div>
        <video id="camera" controlslist="seeking" style="{isVideoPaused ? "display: none" : ""}">
            <track kind="captions">
        </video>
        <audio id="microphone"></audio>
        <div class="controls">
            <button id="mic-button" class="control" onclick={(isAudioPaused ? resumeAudio : pauseAudio)}>
                {@html (isAudioPaused ? micOff : micOn)}
            </button>
            <button id="cam-button" class="control" onclick={(isVideoPaused ? resumeVideo : pauseVideo)}>
                {@html (isVideoPaused ? cameraOff : cameraOn)}
            </button>
            <button id="quit-button" class="control" onclick={quitRoom}>
                {@html quit}
            </button>
        </div>
    </div>
</div>

<style>
    .room {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .controls {
        width: 1;
        height: 4rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .control {
        width: 30%;
        height: 3.5rem;
        border-radius: 1rem;
    }

    #others {
        height: 65rem;
        width: 100%;
        border-radius: 0rem;
        background-color: black;
    }

    #self {
        margin-top: 1rem;
    } 

    #quit-button {
        background-color: #E34234;
    }

    #no-camera {
        width: 15rem;
        height: 11rem;
        background-color: black;
        margin-bottom: 0.3rem;
    }

    video {
        width: 15rem;
        height: 11rem;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import { UserVideoStream, UserAudioStream } from '$lib/UserStream';
    import { goto } from '$app/navigation';
    
    const cameraOn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video" id="Video--Streamline-Feather" height="16" width="16"><desc>Video Streamline Icon: https://streamlinehq.com</desc><path d="m14.375 4.375 -4.375 3.125 4.375 3.125 0 -6.25z" stroke-width="1"></path><path d="M1.875 3.125h6.875s1.25 0 1.25 1.25v6.25s0 1.25 -1.25 1.25H1.875s-1.25 0 -1.25 -1.25V4.375s0 -1.25 1.25 -1.25" stroke-width="1"></path></svg>`;
    const cameraOff = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video-off" id="Video-Off--Streamline-Feather" height="16" width="16"><desc>Video Off Streamline Icon: https://streamlinehq.com</desc><path d="M10 10v0.625a1.25 1.25 0 0 1 -1.25 1.25H1.875a1.25 1.25 0 0 1 -1.25 -1.25V4.375a1.25 1.25 0 0 1 1.25 -1.25h1.25m3.5375 0H8.75a1.25 1.25 0 0 1 1.25 1.25v2.0875l0.625 0.625L14.375 4.375v6.25" stroke-width="1"></path><path d="m0.625 0.625 13.75 13.75" stroke-width="1"></path></svg>`;
    const micOn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic" id="Mic--Streamline-Feather" height="16" width="16"><desc>Mic Streamline Icon: https://streamlinehq.com</desc><path d="M7.5 0.625a1.875 1.875 0 0 0 -1.875 1.875v5a1.875 1.875 0 0 0 3.75 0V2.5a1.875 1.875 0 0 0 -1.875 -1.875z" stroke-width="1"></path><path d="M11.875 6.25v1.25a4.375 4.375 0 0 1 -8.75 0v-1.25" stroke-width="1"></path><path d="m7.5 11.875 0 2.5" stroke-width="1"></path><path d="m5 14.375 5 0" stroke-width="1"></path></svg>`;
    const micOff = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic-off" id="Mic-Off--Streamline-Feather" height="16" width="16"><desc>Mic Off Streamline Icon: https://streamlinehq.com</desc><path d="m0.625 0.625 13.75 13.75" stroke-width="1"></path><path d="M5.625 5.625v1.875a1.875 1.875 0 0 0 3.2 1.3250000000000002M9.375 5.8375V2.5a1.875 1.875 0 0 0 -3.7125000000000004 -0.375" stroke-width="1"></path><path d="M10.625 10.59375A4.375 4.375 0 0 1 3.125 7.5v-1.25m8.75 0v1.25a4.375 4.375 0 0 1 -0.06875 0.76875" stroke-width="1"></path><path d="m7.5 11.875 0 2.5" stroke-width="1"></path><path d="m5 14.375 5 0" stroke-width="1"></path></svg>`;
    const quit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#111111" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle" id="X-Circle--Streamline-Feather" height="16" width="16"><desc>X Circle Streamline Icon: https://streamlinehq.com</desc><path d="M1.25 7.5a6.25 6.25 0 1 0 12.5 0 6.25 6.25 0 1 0 -12.5 0" stroke-width="1"></path><path d="m9.375 5.625 -3.75 3.75" stroke-width="1"></path><path d="m5.625 5.625 3.75 3.75" stroke-width="1"></path></svg>`

    let isVideoPaused = $state(false);
    let pauseVideo = $state(() => { isVideoPaused = true });    
    let resumeVideo = $state(() => { isVideoPaused = false });
    
    let isAudioPaused = $state(false);
    let pauseAudio = $state(() => { isAudioPaused = true });
    let resumeAudio = $state(() => { isAudioPaused = false });

    let quitRoom = $state(() => { goto("/") });
      
    onMount(main);

    async function main()
    {
      try {
        const mimeTypeVideo = 'video/webm; codecs="vp8"'; // TODO might not work for older safari versions
        const mimeTypeAudio = 'audio/webm; codecs="opus"'; // TODO might not work for older safari versions
        const audioConstraints = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };

        let mediaSourceVideo = new MediaSource();
        let videoMediaStream = await navigator.mediaDevices.getUserMedia({video: true});
        let videoMediaRecorder = new MediaRecorder(videoMediaStream, { mimeType: mimeTypeVideo });

        let mediaSourceAudio = new MediaSource();
        let audioMediaStream = await navigator.mediaDevices.getUserMedia({audio: audioConstraints});
        let audioMediaRecorder = new MediaRecorder(audioMediaStream, { mimeType: mimeTypeAudio });

        let userVideo = new UserVideoStream(mediaSourceVideo, null, videoMediaRecorder, mimeTypeVideo);
        let userAudio = new UserAudioStream(mediaSourceAudio, null, audioMediaRecorder, mimeTypeAudio);

        pauseVideo = () => { 
            isVideoPaused = true;
            userVideo.pauseStream();
        };    
        resumeVideo = () => { 
            isVideoPaused = false;
            userVideo.resumeStream();
        };
        pauseAudio = () => { 
            isAudioPaused = true;
            userAudio.pauseStream();
        };    
        resumeAudio = () => { 
            isAudioPaused = false;
            userAudio.resumeStream();
        };

        quitRoom = () => {
            try
            {
                userVideo.pauseStream();
                userVideo.recorder.stop();
                clearInterval(userVideo.intervalId);
                userVideo.mediaSource.endOfStream();

                userAudio.pauseStream();
                userAudio.recorder.stop();
                clearInterval(userAudio.intervalId);
                userAudio.mediaSource.endOfStream();
            } 
            catch (err)
            {
                console.error(err);
            }
            goto("/");
        };

        userVideo.init();
        userAudio.init();        
      } 
      catch (err)
      {
        console.log(err);
      }
    }
</script>