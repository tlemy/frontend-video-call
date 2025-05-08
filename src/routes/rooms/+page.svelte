<div class="room">
    <h1>Room #</h1>
    <div id="others">

    </div>
    <div id="self">
        <video id="camera">
            <track kind="captions">
        </video>
        <audio id="microphone"></audio>
        <div class="controls">
            <button id="mic-button" class="control" onclick={(isAudioPause ? resumeAudio : pauseAudio)}>
                {@html (isAudioPause ? micOff : micOn)}
            </button>
            <button id="cam-button" class="control" onclick={(isVideoPause ? resumeVideo : pauseVideo)}>
                {@html (isVideoPause ? cameraOff : cameraOn)}
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
        background-color: b;
    }

    .controls {
        width: 1;
        height: 4em;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .control {
        width: 30%;
        height: 5em;
        border-radius: 1em;
    }

    #others {
        height: 65em;
        width: 105em;
        border-radius: 0em;
        background-color: black;
    }

    #self {
        margin-top: 1em;
    } 

    #quit-button {
        background-color: #E34234;
    }

    video {
        width: 15em;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    
    const cameraOn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video" id="Video--Streamline-Feather" height="16" width="16"><desc>Video Streamline Icon: https://streamlinehq.com</desc><path d="m14.375 4.375 -4.375 3.125 4.375 3.125 0 -6.25z" stroke-width="1"></path><path d="M1.875 3.125h6.875s1.25 0 1.25 1.25v6.25s0 1.25 -1.25 1.25H1.875s-1.25 0 -1.25 -1.25V4.375s0 -1.25 1.25 -1.25" stroke-width="1"></path></svg>`;
    const cameraOff = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video-off" id="Video-Off--Streamline-Feather" height="16" width="16"><desc>Video Off Streamline Icon: https://streamlinehq.com</desc><path d="M10 10v0.625a1.25 1.25 0 0 1 -1.25 1.25H1.875a1.25 1.25 0 0 1 -1.25 -1.25V4.375a1.25 1.25 0 0 1 1.25 -1.25h1.25m3.5375 0H8.75a1.25 1.25 0 0 1 1.25 1.25v2.0875l0.625 0.625L14.375 4.375v6.25" stroke-width="1"></path><path d="m0.625 0.625 13.75 13.75" stroke-width="1"></path></svg>`;
    const micOn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic" id="Mic--Streamline-Feather" height="16" width="16"><desc>Mic Streamline Icon: https://streamlinehq.com</desc><path d="M7.5 0.625a1.875 1.875 0 0 0 -1.875 1.875v5a1.875 1.875 0 0 0 3.75 0V2.5a1.875 1.875 0 0 0 -1.875 -1.875z" stroke-width="1"></path><path d="M11.875 6.25v1.25a4.375 4.375 0 0 1 -8.75 0v-1.25" stroke-width="1"></path><path d="m7.5 11.875 0 2.5" stroke-width="1"></path><path d="m5 14.375 5 0" stroke-width="1"></path></svg>`;
    const micOff = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic-off" id="Mic-Off--Streamline-Feather" height="16" width="16"><desc>Mic Off Streamline Icon: https://streamlinehq.com</desc><path d="m0.625 0.625 13.75 13.75" stroke-width="1"></path><path d="M5.625 5.625v1.875a1.875 1.875 0 0 0 3.2 1.3250000000000002M9.375 5.8375V2.5a1.875 1.875 0 0 0 -3.7125000000000004 -0.375" stroke-width="1"></path><path d="M10.625 10.59375A4.375 4.375 0 0 1 3.125 7.5v-1.25m8.75 0v1.25a4.375 4.375 0 0 1 -0.06875 0.76875" stroke-width="1"></path><path d="m7.5 11.875 0 2.5" stroke-width="1"></path><path d="m5 14.375 5 0" stroke-width="1"></path></svg>`;
    const quit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#111111" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle" id="X-Circle--Streamline-Feather" height="16" width="16"><desc>X Circle Streamline Icon: https://streamlinehq.com</desc><path d="M1.25 7.5a6.25 6.25 0 1 0 12.5 0 6.25 6.25 0 1 0 -12.5 0" stroke-width="1"></path><path d="m9.375 5.625 -3.75 3.75" stroke-width="1"></path><path d="m5.625 5.625 3.75 3.75" stroke-width="1"></path></svg>`

    const delay = 5;
    const mimeTypeVideo = 'video/webm; codecs="vp8"'; // TODO might not work for older safari versions
    const mimeTypeAudio = 'video/webm; codecs="opus"'; // TODO might not work for older safari versions
    const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };

    let mediaSourceVideo: MediaSource;
    let sourceBufferVideo: SourceBuffer | null = null;
    let recorderVideo: MediaRecorder | null = null;
    let isVideoPause = $state(false);

    const pauseVideo = () => {
        recorderVideo?.pause();
    };
    
    const resumeVideo = () => {
        recorderVideo?.resume();
    };

    let mediaSourceAudio: MediaSource;
    let sourceBufferAudio: SourceBuffer | null = null;
    let recorderAudio: MediaRecorder | null = null;
    let isAudioPause = $state(false);

    const pauseAudio = () => {
        recorderAudio?.pause();
    };

    const resumeAudio = () => {
        recorderAudio?.resume();
    };

    const quitRoom = () => {
        
    }
      
    onMount(async () => {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({video: true});
        mediaSourceVideo = new MediaSource();
        recorderVideo = new MediaRecorder(videoStream, { mimeType: mimeTypeVideo });

        const userVideo = new UserVideoStream(mediaSourceVideo, sourceBufferVideo, recorderVideo);
        userVideo.setupVideo(mediaSourceVideo, mimeTypeVideo);
        userVideo.setupRecorder(recorderVideo);

        const audioStream = await navigator.mediaDevices.getUserMedia({audio: audioConstraints});
        mediaSourceAudio = new MediaSource();
        recorderAudio = new MediaRecorder(audioStream, { mimeType: mimeTypeAudio });
        
        const userAudio = new UserAudioStream(mediaSourceAudio, sourceBufferAudio, recorderAudio);
        userAudio.setupAudio(mediaSourceAudio, mimeTypeAudio);
        userAudio.setupRecorder(recorderAudio);

        recorderVideo?.addEventListener("pause", () => {
            console.log("pause", isVideoPause);
            isVideoPause = true;
            getVideoElement();
        }, );

        recorderVideo?.addEventListener("resume", () => {
            console.log("pause", isVideoPause);
            isVideoPause = false;
        });

        recorderAudio?.addEventListener("pause", () => {
            console.log("pause", isAudioPause);
            isAudioPause = true;
        }, );

        recorderAudio?.addEventListener("resume", () => {
            console.log("pause", isAudioPause);
            isAudioPause = false;
        });
      } 
      catch (err) {}
    });

    function getVideoElement()
    {
        return document.querySelector('#camera') as HTMLVideoElement;
    }

    class UserStream {
        constructor(_mediaSource: MediaSource, _sourceBuffer: SourceBuffer | null, _recorder: MediaRecorder)
        {
            this.mediaSource = _mediaSource;
            this.sourceBuffer = _sourceBuffer;
            this.recorder = _recorder;
        }
        mediaSource: MediaSource;
        sourceBuffer: SourceBuffer | null;
        recorder: MediaRecorder;

        setupRecorder(recorder: MediaRecorder)
        {
            recorder.ondataavailable = async (event) => {
                if (event.data.size > 0 && this.sourceBuffer && !this.sourceBuffer.updating) {
                    const buffer = await event.data.arrayBuffer();
                    this.appendToSourceBuffer(buffer);
                }
            }
    
            recorder.start(delay);
        }

        appendToSourceBuffer(chunk: ArrayBuffer)
        {
            if (!this.sourceBuffer?.updating && this.mediaSource.readyState === 'open') {

                try {
                    this.sourceBuffer?.appendBuffer(chunk);
                } 
                catch (error) {
                    console.log(error);    
                }
            } else {
                setTimeout(() => this.appendToSourceBuffer(chunk), delay / 2);
            }
        }

        addEventListenerSource(source: MediaSource, mimeType: string)
        {
            source.addEventListener('sourceopen', () => {
                console.log('MediaSource ready');
                this.sourceBuffer = source.addSourceBuffer(mimeType);
                this.sourceBuffer.mode = 'sequence';
            }, { once: true });
        }

        pauseStream() 
        {
            this.recorder.pause();
        }

        resumeStream()
        {
            this.recorder.resume();
        }
    };

    class UserVideoStream extends UserStream
    {
        setupVideo(source: MediaSource, mimeType: string)
        {
            const video = getVideoElement();
            
            this.addEventListenerSource(source, mimeType);
        
            video.src = URL.createObjectURL(source);
            video.play().catch((err) => {});
        }
    }

    class UserAudioStream extends UserStream
    {
        setupAudio(source: MediaSource, mimeType: string)
        {
            const audio = document.querySelector('#microphone') as HTMLAudioElement;
            
            this.addEventListenerSource(source, mimeType);
        
            audio.src = URL.createObjectURL(source);
            audio.play().catch((err) => {});
        }
    }
</script>