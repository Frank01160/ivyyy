
/* ============================================================
   gravity.js
   A lightweight physics playground.
   - Desktop: mouse position creates a gravity direction.
   - Mobile: device orientation controls gravity when permitted.
   - Dragging is also supported.
   ============================================================ */

document.addEventListener("DOMContentLoaded",()=>{

    const world=document.getElementById("gravity-world");
    const objects=[...document.querySelectorAll(".gravity-object")];
    const reset=document.getElementById("gravity-reset");

    if(!world || !objects.length) return;

    const state=objects.map((el,i)=>({
        el,
        x:window.innerWidth*(.2+Math.random()*.6),
        y:window.innerHeight*(.2+Math.random()*.6),
        vx:(Math.random()-.5)*1.5,
        vy:(Math.random()-.5)*1.5,
        r:18+Math.random()*28,
        phase:i
    }));

    let gravity={x:0,y:.18};
    let targetGravity={x:0,y:.18};

    function pointerGravity(x,y){
        const cx=window.innerWidth/2;
        const cy=window.innerHeight/2;
        const dx=(x-cx)/cx;
        const dy=(y-cy)/cy;
        targetGravity={x:dx*.55,y:dy*.55};
    }

    window.addEventListener("mousemove",e=>{
        pointerGravity(e.clientX,e.clientY);
    },{passive:true});

    /* ---------- Phone tilt ---------- */
    function handleOrientation(e){
        const gamma=Math.max(-45,Math.min(45,e.gamma||0));
        const beta=Math.max(-45,Math.min(45,(e.beta||0)-45));
        targetGravity={
            x:gamma/45*.65,
            y:beta/45*.65
        };
    }

    async function enableOrientation(){
        try{
            if(typeof DeviceOrientationEvent!=="undefined" &&
               typeof DeviceOrientationEvent.requestPermission==="function"){
                const permission=await DeviceOrientationEvent.requestPermission();
                if(permission==="granted"){
                    window.addEventListener("deviceorientation",handleOrientation);
                }
            }else{
                window.addEventListener("deviceorientation",handleOrientation);
            }
        }catch(err){}
    }

    world.addEventListener("click",()=>{
        if(window.innerWidth<=800) enableOrientation();
    },{once:true});

    /* ---------- Drag ---------- */
    let dragged=null;

    objects.forEach((el,i)=>{
        const item=state[i];

        el.addEventListener("pointerdown",e=>{
            dragged={item,offsetX:e.clientX-item.x,offsetY:e.clientY-item.y};
            el.setPointerCapture?.(e.pointerId);
        });

        el.addEventListener("pointermove",e=>{
            if(!dragged || dragged.item!==item) return;
            item.x=e.clientX-dragged.offsetX;
            item.y=e.clientY-dragged.offsetY;
            item.vx=item.vy=0;
        });

        el.addEventListener("pointerup",()=>{
            if(dragged?.item===item) dragged=null;
        });
    });

    reset?.addEventListener("click",()=>{
        state.forEach((item,i)=>{
            item.x=window.innerWidth*(.2+Math.random()*.6);
            item.y=window.innerHeight*(.2+Math.random()*.6);
            item.vx=(Math.random()-.5)*1.5;
            item.vy=(Math.random()-.5)*1.5;
        });
        targetGravity={x:0,y:.18};
    });

    function animate(){
        gravity.x+=(targetGravity.x-gravity.x)*.04;
        gravity.y+=(targetGravity.y-gravity.y)*.04;

        state.forEach((item,i)=>{
            if(!dragged || dragged.item!==item){
                item.vx+=gravity.x*.08;
                item.vy+=gravity.y*.08;

                /* gentle mutual repulsion */
                state.forEach((other,j)=>{
                    if(i===j)return;
                    const dx=item.x-other.x;
                    const dy=item.y-other.y;
                    const dist=Math.hypot(dx,dy);
                    if(dist>0 && dist<75){
                        item.vx+=(dx/dist)*.002;
                        item.vy+=(dy/dist)*.002;
                    }
                });

                item.vx*=.995;
                item.vy*=.995;
                item.x+=item.vx;
                item.y+=item.vy;
            }

            const margin=20;
            if(item.x<margin){item.x=margin;item.vx*=-.7}
            if(item.x>window.innerWidth-margin){item.x=window.innerWidth-margin;item.vx*=-.7}
            if(item.y<margin+70){item.y=margin+70;item.vy*=-.7}
            if(item.y>window.innerHeight-margin){item.y=window.innerHeight-margin;item.vy*=-.7}

            const wobble=Math.sin(performance.now()/1000+item.phase)*3;
            item.el.style.transform=`translate3d(${item.x-item.el.offsetWidth/2}px,${item.y-item.el.offsetHeight/2}px,0) rotate(${wobble}deg)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
});
