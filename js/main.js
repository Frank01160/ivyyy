
/* ============================================================
   main.js
   Global interactions, scroll atmosphere and reveal effects.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const sky = document.getElementById("sky-background");
    const sun = document.getElementById("sun");
    const replay = document.getElementById("replay-story");
    const enter = document.getElementById("enter-world");

    /* ---------- Create stars ---------- */
    const stars = document.getElementById("stars");
    for(let i=0;i<110;i++){
        const s=document.createElement("span");
        s.className="star";
        s.style.left=Math.random()*100+"%";
        s.style.top=Math.random()*100+"%";
        s.style.animationDelay=(Math.random()*4)+"s";
        s.style.opacity=(.25+Math.random()*.75);
        stars.appendChild(s);
    }

    /* ---------- Create bokeh ---------- */
    const bokeh = document.getElementById("bokeh-field");
    for(let i=0;i<18;i++){
        const b=document.createElement("span");
        b.className="bokeh";
        b.style.left=Math.random()*100+"%";
        b.style.top=Math.random()*100+"%";
        b.style.animationDelay=(Math.random()*8)+"s";
        bokeh.appendChild(b);
    }

    /* ---------- Create clouds ---------- */
    const clouds = document.getElementById("cloud-layer");
    for(let i=0;i<6;i++){
        const c=document.createElement("span");
        c.className="cloud";
        c.style.top=(10+Math.random()*65)+"%";
        c.style.left=(-30-Math.random()*30)+"%";
        c.style.animationDelay=(-Math.random()*55)+"s";
        c.style.animationDuration=(45+Math.random()*35)+"s";
        clouds.appendChild(c);
    }

    /* ---------- Scroll-driven sun / sky ---------- */
    function updateSky(){
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY/max : 0;

        sky.classList.toggle("day", progress > .20 && progress < .72);
        sky.classList.toggle("sunset", progress >= .72 && progress < .90);

        if(sun){
            const x = 15 + progress*70;
            const y = 78 - progress*92;
            sun.style.transform = `translate(${x}vw, ${y}vh)`;
        }
    }

    window.addEventListener("scroll", updateSky, {passive:true});
    window.addEventListener("resize", updateSky);
    updateSky();

    /* ---------- Reveal sections ---------- */
    const revealTargets=document.querySelectorAll(
        ".section-intro,.moon-story,.chat-story,.road-sign,.flirt-card,.memory-card,.envelope,.secret-container,.ending-content"
    );
    revealTargets.forEach(el=>el.classList.add("reveal"));

    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },{threshold:.12});

    revealTargets.forEach(el=>observer.observe(el));

    /* ---------- Smooth entry ---------- */
    enter?.addEventListener("click",()=>{
        document.getElementById("story")?.scrollIntoView({behavior:"smooth"});
    });

    replay?.addEventListener("click",()=>{
        window.scrollTo({top:0,behavior:"smooth"});
    });

    /* ---------- Road sign mini memories ---------- */
    document.querySelectorAll(".road-sign").forEach(sign=>{
        sign.addEventListener("click",()=>{
            const memory=sign.dataset.memory;
            const messages={
                moon:"The moon line was bold for a first conversation. 🌙",
                ivy:"And then Poison Ivy entered the conversation. 😏",
                engineering:"Somehow the conversation turned into engineering clues.",
                kababa:"And somewhere along the way... Kababa happened. 😂"
            };
            showToast(messages[memory] || "Another little piece of our story.");
        });
    });

    window.showToast = function(message){
        let toast=document.getElementById("site-toast");
        if(!toast){
            toast=document.createElement("div");
            toast.id="site-toast";
            toast.style.cssText=`
                position:fixed;left:50%;bottom:85px;z-index:150;
                transform:translate(-50%,20px);opacity:0;
                max-width:min(500px,90vw);padding:14px 18px;
                border:1px solid rgba(255,255,255,.18);
                border-radius:16px;background:rgba(15,10,16,.88);
                color:#f7efe8;backdrop-filter:blur(15px);
                font:14px "Cormorant Garamond",serif;text-align:center;
                transition:.35s ease;pointer-events:none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent=message;
        requestAnimationFrame(()=>{
            toast.style.opacity="1";
            toast.style.transform="translate(-50%,0)";
        });
        clearTimeout(window.__toastTimer);
        window.__toastTimer=setTimeout(()=>{
            toast.style.opacity="0";
            toast.style.transform="translate(-50%,20px)";
        },2600);
    };
});


/* ---------- Open When letters ---------- */
document.addEventListener("DOMContentLoaded",()=>{
    const modal=document.getElementById("letter-modal");
    const title=document.getElementById("letter-title");
    const text=document.getElementById("letter-text");

    const letters={
        "miss-me":{
            title:"You miss me",
            text:"Then come a little closer.\n\nPretend I'm sitting next to you for a minute.\n\nAnd yes... you are allowed to miss me. ♥"
        },
        "bad-day":{
            title:"You're having a bad day",
            text:"Whatever happened today, it doesn't get to decide how tomorrow feels.\n\nTake a breath. Drink some water. And remember that somewhere out here, Frank is rooting for you."
        },
        "thinking":{
            title:"You're thinking about me",
            text:"Caught you. 👀\n\nI knew there was a reason you opened this one."
        },
        "attention":{
            title:"You want attention",
            text:"Ohhh, so that's what this is about. 😏\n\nFine. You have my attention.\n\nHappy now, Ivy?"
        }
    };

    document.querySelectorAll(".envelope").forEach(envelope=>{
        envelope.addEventListener("click",()=>{
            const data=letters[envelope.dataset.letter];
            if(!data)return;
            title.textContent=data.title;
            text.textContent=data.text;
            modal.classList.add("open");
            modal.setAttribute("aria-hidden","false");
        });
    });

    const secretOpen=document.getElementById("secret-open");
    const secretMessage=document.getElementById("secret-message");

    secretOpen?.addEventListener("click",()=>{
        secretMessage?.classList.add("revealed");
        secretOpen.textContent="I warned you 😏";
    });
});
