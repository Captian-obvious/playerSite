// Constants
const reader = window.jsmediatags
// Variables

// MAIN
var viewer = {
    Initalized: false,
    MediaPlayer: {
        Initalized: false,
        Initialize: function() {
            if (this.Initialized === false) {
                this.Initialized = true
                window.audio = new Audio();
                console.log(audio);
                window.dur = document.getElementById("MediaPlayerControl-seekbar");
                window.album = document.getElementById("album");
                window.album2 = document.getElementById("img2");
                window.dataimage = document.getElementById("MediaPlayerIcon-icon-play");
                window.button = document.getElementById("MediaPlayerIcon-icon-play");
                window.position = document.getElementById("time-position");
                window.setting = document.getElementById("sound_options");
                window.vol = document.getElementById("volume");
                window.debounce = true
                window.context = new AudioContext();
                console.log(context);
                window.src = context.createMediaElementSource(audio);
                window.analyser = context.createAnalyser();
                window.loud = 0;
                window.gn = context.createGain();
                analyser.connect(gn);
                gn.connect(context.destination);
                var fft_Size = 512;
                analyser.fftSize = fft_Size;
                analyser.maxDecibels = -3;
                analyser.minDecibels = -150;
                window.bufferLength = analyser.frequencyBinCount;
                console.log(bufferLength);
                console.log(analyser);
            } else {
                console.log('FileViewer Exception: Already Initialized!')
            },
        },
        Play: function(files) {
            if (this.Initialized === false) {
                console.log('FileViewer Exception: MediaPlayer Must Be Initialized First!')
            } else {
                function getRMS(arr) {
                    var square = 0;
                    var mean = 0;
                    var rms = 0;
                    var n = arr.length;
                    for (var i = 0; i < n; i++) {
                        square += Math.pow(arr[i], 2);
                    };
                    mean = square / n;
                    rms = Math.sqrt(mean);
                    return rms
                };
                
                function calcRMSColor(rms) {
                    let intermed = rms / 100;
                    let ret = intermed * 150;
                    return ret
                };
                function formatTime(val) {
                    var min = Math.floor(val / 60);
                    var sec = Math.floor(val - min * 60);
                    if (sec < 10) {
                        sec = "0" + sec;
                    };
                    return min + ":" + sec
                };
                var index=0;
                var colorValue = "#ff0000";
                dataimage.setAttribute("data-mediathumb-url", URL.createObjectURL(files[0]));
                var SRC = dataimage.getAttribute("data-mediathumb-url");
                audio.src = SRC;
                audio.load();
                function playNext(audio,i) {
                    if (debounce === true) {
                        debounce = false
                        var input = files[i].name;
                        dataimage.setAttribute("data-mediathumb-url", URL.createObjectURL(files[i]));
                        var SRC = dataimage.getAttribute("data-mediathumb-url");
                        audio.src = SRC;
                        audio.load();
                        var input = files[i].name;
                        if (filetitle.textContent != "Unknown Artist - " + files[i].name) {
                            filetitle.textContent = "Unknown Artist - " + files[i].name;
                        };
                        if (album.style.backgroundImage != "url(../../images/default/default-album-icon.png)") {
                            album.style.backgroundImage = "url(../../images/default/default-album-icon.png)";
                        };
                        if (album2.src != "../../images/default/default_background.png") {
                            album2.src = "../../images/default/default_background.png";
                        };
                        reader.read(files[i], {
                            onSuccess: function(tag) {
                                console.log(tag);
                                const data = tag.tags.picture.data;
                                const format = tag.tags.picture.format;
                                const title = tag.tags.title;
                                const artist = tag.tags.artist;
                                if (data.length != 0 && format != null) {
                                    let str = "";
                                    for (var o = 0; o < data.length; o++) {
                                        str += String.fromCharCode(data[o]);
                                    };
                                    var url = "data:" + format + ";base64," + window.btoa(str);
                                    album.style.backgroundImage = "url(" + url + ")";
                                    album2.src = url;
                                };
                                if (title != "" && artist != "") {
                                    filetitle.textContent = artist + " - " + title;
                                };
                            },
                            onError: function(error) {
                                console.log(error);
                            },
                        });
                        audio.play();
                        setTimeout(function(){
                            debounce = true;
                        },100);
                    }
                }
                var input = files[0].name;
                if (filetitle.textContent != "Unknown Artist - " + files[0].name) {
                    filetitle.textContent = "Unknown Artist - " + files[0].name;
                };
                if (album.style.backgroundImage != "url(../../images/default/default-album-icon.png)") {
                    album.style.backgroundImage = "url(../../images/default/default-album-icon.png)";
                };
                if (album2.src != "../../images/default/default_background.png") {
                    album2.src = "../../images/default/default_background.png";
                };
                reader.read(files[0], {
                    onSuccess: function(tag) {
                        console.log(tag);
                        const data = tag.tags.picture.data;
                        const format = tag.tags.picture.format;
                        const title = tag.tags.title;
                        const artist = tag.tags.artist;
                        if (data.length != 0 && format != null) {
                            let str = "";
                            for (var o = 0; o < data.length; o++) {
                                str += String.fromCharCode(data[o]);
                            };
                            var url = "data:" + format + ";base64," + window.btoa(str);
                            album.style.backgroundImage = "url(" + url + ")";
                            album2.src = url;
                        };
                        if (title != "" && artist != "") {
                            filetitle.textContent = artist + " - " + title;
                        };
                    },
                    onError: function(error) {
                        console.log(error);
                    },
                });
                var canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                document.body.appendChild(audio);
                canvas.style = `width: 100%; height: 100%;`;
                audio.style='height: 10%; width: 100%; top: 90%;';
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                var ctx = canvas.getContext("2d");
                var dataArray = new Uint8Array(bufferLength);
                var dataArray1 = new Uint8Array(fft_Size);
                function renderFrame() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    var maxHeight = canvas.height / 2;
                    var WIDTH = canvas.width;
                    var HEIGHT = canvas.height;
                    var unit = WIDTH / bufferLength
                    var barWidth = (unit)-1;
                    var barHeight;
                    requestAnimationFrame(renderFrame);
                    analyser.getByteFrequencyData(dataArray);
                    analyser.getByteTimeDomainData(dataArray1);
                    var x = 0
                    var y = 0
                    ctx.clearRect(0, 0, WIDTH, HEIGHT);
                    for (var i=0;i<dataArray.length;i++) {
                        barHeight = (dataArray[i]/255)*maxHeight
                        var r = (barHeight / maxHeight) * 255 + 25 * (i / bufferLength);
                        var g = 250 * (i / bufferLength);
                        var b = 50;
                        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                        ctx.fillRect(x,y,barWidth, barHeight)
                        x += unit
                    };
                    x = 0
                };
                renderFrame();
                audio.addEventListener("ended", function() {
                    button.className = "MediaPlayerIcon icon-play";
                    dur.value = dur.max;
                    index += 1;
                    if (files.length > 1) {
                        playNext(audio,index);
                    };
                });
            },
        },
    },
    Initialize: function() {
        if (this.Initialized === false) {
            this.Initialized = true
        } else {
            console.log('FileViewer Exception: MODULE_ALREADY_RUNNING')
        },
    },
    Open: function(files) {
        if (files!=null) {
            AudioArray = [];
            ImageArray = [];
            for (var i=0; i<files.length; i++) {
                if (files[i].type==='audio/*') {
                    AudioArray[i] = files[i]
                },
                if (files[i].type==='image/*') {
                    ImageArray[i] = files[i]
                },
            },
            if (AudioArray.length>0) {
                this.MediaPlayer.Play(AudioArray)
            },
        } else {
            console.log('FileViewer Exception: INVALID_INPUT_OR_NULL.')
        },
    },
}
window.fv = viewer
