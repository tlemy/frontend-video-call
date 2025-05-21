const timeslice = 50;
const interval = 500;
const delayMax = 0.5;

class UserStream {
    constructor(_mediaSource: MediaSource, _sourceBuffer: SourceBuffer | null, _recorder: MediaRecorder, _mimeType: string)
    {
        this.mediaSource = _mediaSource;
        this.sourceBuffer = _sourceBuffer;
        this.recorder = _recorder;
        this.isPause = false;
        this.mimeType = _mimeType;
    }
    mediaSource: MediaSource;
    sourceBuffer: SourceBuffer | null;
    recorder: MediaRecorder;
    isPause: boolean;
    mimeType: string;
    device: HTMLVideoElement | HTMLAudioElement |  null = null;
    intervalId: number = 0;

    setupRecorder()
    {
        this.recorder.ondataavailable = async (event) => {
            if (!this.isPause && event.data.size > 0 && this.sourceBuffer && !this.sourceBuffer.updating)
            {
                this.appendToSourceBuffer(await event.data.arrayBuffer());
            }
        }
        this.recorder.start(timeslice);
    }
    
    setLive()
    {
        const seekable = this.device?.seekable.end(0);

        if (this.device && seekable && seekable > 0)
        {
            const current = this.device?.currentTime;
            const diff = seekable - current;

            if (diff > delayMax || this.isPause)
            {
                this.device.currentTime = seekable;
                console.log(diff);
            }
        }
    }

    setupBufferCleaner()
    {
        this.intervalId = setInterval(() => {
            try 
            {   
                this.setLive();
            }
            catch (err)
            {
                console.log(err);
            }
        }, interval);
    }

    appendToSourceBuffer(chunk: ArrayBuffer)
    {
        if (!this.isPause && !this.sourceBuffer?.updating && this.mediaSource.readyState === 'open')
        {
            try
            {
                if (this.sourceBuffer)
                {
                    this.sourceBuffer?.appendBuffer(chunk);
                }
            } 
            catch (error) 
            {
                console.log(error);    
            }
        }
        else
        {
            this.pauseStream();

            setTimeout(() => {
                this.appendToSourceBuffer(chunk)
            }, interval / 2);
        }
    }

    createNewSourceBuffer()
    {
        if (this.mediaSource.sourceBuffers.length == 0)
        {
            this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeType);
            this.sourceBuffer.mode = 'sequence';
        }
    }

    addEventListenerSource()
    {
        this.mediaSource.addEventListener('sourceopen', () => {
            this.createNewSourceBuffer();
        }, { once: true });
    }

    pauseStream() 
    {
        this.isPause = true;
        this.recorder.pause();
    }

    resumeStream()
    {
        this.isPause = false;
        this.recorder.resume();
    }
}

export class UserVideoStream extends UserStream
{
    setupVideo()
    {
        this.addEventListenerSource();
    
        this.device = document.querySelector('#camera') as HTMLVideoElement;
        this.device.src = URL.createObjectURL(this.mediaSource);
        this.device.play().catch((err) => {});

        this.setupBufferCleaner();
    }

    init()
    {
        try
        {

            this.setupVideo();
            this.setupRecorder();

            this.recorder?.addEventListener("error", (e) => {
                console.error(e);
            });
        } 
        catch (err)
        {
            console.log(err);
        }
    }
}

export class UserAudioStream extends UserStream
{
    setupAudio()
    {
        this.addEventListenerSource();
        
        this.device = document.querySelector('#microphone') as HTMLAudioElement;
        this.device.src = URL.createObjectURL(this.mediaSource);
        this.device.play().catch((err) => {});

        this.setupBufferCleaner();
    }

    init()
    {
        try
        {

            this.setupAudio();
            this.setupRecorder();

            this.recorder?.addEventListener("error", (e) => {
                console.error(e);
            });
        } 
        catch (err)
        {
            console.log(err);
        }
    }
}

