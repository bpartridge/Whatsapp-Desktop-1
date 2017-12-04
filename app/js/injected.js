(function () {
    var audioCss = document.createElement("style");
    audioCss.setAttribute('type', 'text/css');

    const {ipcRenderer} = require('electron');
    var updatePhoneInfoInterval = null;

    function updatePhoneInfo() {
        if (window.Store == undefined || window.Store.Conn == undefined) {
            return;
        }
        ipcRenderer.send('phoneinfoupdate', {
            'info': window.Store.Stream.info,
            'me': "+" + window.Store.Conn.me.split("@")[0],
            'battery': window.Store.Conn.battery,
            'plugged': window.Store.Conn.plugged,
            'platform': window.Store.Conn.platform,
            'phoneActive': window.Store.Stream.phoneActive,
            'phone': {
                'manufacturer': window.Store.Conn.phone.device_manufacturer,
                'model': window.Store.Conn.phone.device_model,
                'mcc': window.Store.Conn.phone.mcc,
                'mnc': window.Store.Conn.phone.mnc,
                'os_build_number': window.Store.Conn.phone.os_build_number,
                'os_version': window.Store.Conn.phone.os_version,
                'wa_version': window.Store.Conn.phone.wa_version
            }
        });
        if (updatePhoneInfoInterval != null) {
            clearInterval(updatePhoneInfoInterval);
            updatePhoneInfoInterval = null;
            setInterval(updatePhoneInfo, 2000)
        }
    }

    console.log("Waiting for DOMContentLoaded");
    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOMContentLoaded event");
        updatePhoneInfoInterval = setInterval(updatePhoneInfo, 500);

        // pass in the target node, as well as the observer options
        var observer = new MutationObserver(function (mutations) {
            console.log("Mutations occurred: ", mutations.length);
            var inputSearch = document.querySelector("input.input-search");
            if (inputSearch) {
                console.log("Adding event listeners");

                document.addEventListener("keydown", function (event) {
                    // cmd+k and cmd+f focuses on search input.
                    if ((event.keyCode === 75 || event.keyCode == 70) && event.metaKey === true)
                        inputSearch.focus();
                });

                console.log("Disconnecting the observer");
                observer.disconnect();
            }
        });

        var config = {childList: true, subtree: true};
        observer.observe(document.querySelector("body"), config);

        document.head.appendChild(audioCss);
    }, false);


    window.registeredAudioRate = undefined;
    setInterval(function() {
        if (window.audioRate) {
            // Need to do this every tick as new audio elements may have appeared
            Array.from(document.querySelectorAll('audio')).map(function(audio) {
                audio.playbackRate = window.audioRate;
            });
            // But changing CSS only needs to be done on change
            if (window.audioRate !== window.registeredAudioRate) {
                window.registeredAudioRate = window.audioRate;
                audioCss.innerHTML = `
                    [data-icon*="audio-"]:after {
                        content: '${(window.audioRate).toFixed(1)}x';
                        position: absolute;
                        left: 0; right: 0; bottom: -14px;
                        color: rgba(0,0,0,0.45);
                    }
                `;
            }
        }
    }, 200);
})();
