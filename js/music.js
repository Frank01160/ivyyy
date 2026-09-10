
/* ============================================================
   music.js
   Browser-friendly music control.
   Note: browsers usually block autoplay with sound until a
   user gesture. The Enter button is therefore used to start it.
   ============================================================ */

document.addEventListener("DOMContentLoaded",()=>{
    const audio=document.getElementById("our-song");
    const toggle=document.getElementById("music-toggle");
    const enter=document.getElementById("enter-world");

    if(!audio || !toggle) return;

    let playing=false;

    function updateButton(){
        toggle.querySelector(".music-icon").textContent=playing ? "❚❚" : "♪";
        toggle.querySelector(".music-label").textContent=playing ? "Playing" : "Our song";
        toggle.setAttribute("aria-label",playing ? "Pause our song" : "Play our song");
    }

    async function playMusic(){
        try{
            await audio.play();
            playing=true;
            updateButton();
        }catch(error){
            playing=false;
            updateButton();
        }
    }

    function pauseMusic(){
        audio.pause();
        playing=false;
        updateButton();
    }

    enter?.addEventListener("click",playMusic);

    toggle.addEventListener("click",()=>{
        playing ? pauseMusic() : playMusic();
    });

    audio.addEventListener("play",()=>{
        playing=true; updateButton();
    });

    audio.addEventListener("pause",()=>{
        playing=false; updateButton();
    });

    updateButton();
});
