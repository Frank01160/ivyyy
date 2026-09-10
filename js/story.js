
/* ============================================================
   story.js
   Small story interactions.
   ============================================================ */

document.addEventListener("DOMContentLoaded",()=>{

    const chatMessages=document.querySelectorAll(".chat-message");

    const chatObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.animate(
                    [
                        {opacity:0,transform:"translateY(15px)"},
                        {opacity:1,transform:"translateY(0)"}
                    ],
                    {duration:500,easing:"ease-out",fill:"forwards"}
                );
                chatObserver.unobserve(entry.target);
            }
        });
    },{threshold:.25});

    chatMessages.forEach((message,index)=>{
        message.style.opacity="0";
        message.style.animationDelay=(index*80)+"ms";
        chatObserver.observe(message);
    });

});
