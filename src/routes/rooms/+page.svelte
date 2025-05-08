<div class="room">
    <h1>Room #</h1>
    <div id="others">

    </div>
    <div id="self">
        <video id="camera"></video>
        <div class="controls">

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
        border: 1px solid black;
        margin-top: -1em;
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

    video {
        width: 15em;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
  
    const delay = 5;
    const mimeType = 'video/webm; codecs="vp8,opus"'; // TODO might not work for older safari versions
    let mediaSource: MediaSource;
    let sourceBuffer: SourceBuffer | null = null;
    let recorder: MediaRecorder | null = null;
  
    onMount(async () => {
      try {
        const audioConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        };

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: audioConstraints});
        mediaSource = new MediaSource();
        recorder = new MediaRecorder(stream, { mimeType });
  
        setupVideo(mediaSource);
        setupRecorder(recorder);
      } 
      catch (err) {}
    });
  
    function setupVideo(source: MediaSource) {
      const video = document.querySelector('#camera') as HTMLVideoElement;
      
      source.addEventListener('sourceopen', () => {
        console.log('MediaSource ready');
        sourceBuffer = source.addSourceBuffer(mimeType);
        sourceBuffer.mode = 'sequence';
      }, { once: true });
  
      video.src = URL.createObjectURL(source);
      video.play().catch((err) => {});
    }
  
    function setupRecorder(recorder: MediaRecorder) {
        recorder.ondataavailable = async (event) => {
            if (event.data.size > 0 && sourceBuffer && !sourceBuffer.updating) {
                const buffer = await event.data.arrayBuffer();
                appendToSourceBuffer(buffer);
            }
        }
  
      recorder.start(delay);
    }

    function appendToSourceBuffer(chunk: ArrayBuffer) {

        console.log("append", !sourceBuffer?.updating, mediaSource.readyState === 'open');

        if (!sourceBuffer?.updating && mediaSource.readyState === 'open') {

            try {
                sourceBuffer?.appendBuffer(chunk);
            } 
            catch (error) {
                console.log(error);    
            }
        } else {
            setTimeout(() => appendToSourceBuffer(chunk), delay / 2);
        }
    }
</script>