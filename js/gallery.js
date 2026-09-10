
/* ============================================================
   gallery.js
   Gallery count, future-memory card and simple photo viewer.
   GitHub Pages note:
   A visitor cannot permanently upload into your repository
   from browser-only HTML. The future card is therefore a
   beautiful placeholder until you manually add a new image.
   ============================================================ */

document.addEventListener("DOMContentLoaded",()=>{

    const count=document.getElementById("memory-count");
    const create=document.getElementById("create-memory");
    const modal=document.getElementById("memory-modal");
    const modalContent=document.getElementById("memory-modal-content");

    document.querySelectorAll(".gallery-image").forEach(img=>{
        img.style.cursor="zoom-in";

        img.addEventListener("click",()=>{
            if(!modal || !modalContent)return;

            modalContent.innerHTML=`
                <div style="
                    background:#120d12;
                    padding:15px;
                    border-radius:20px;
                    border:1px solid rgba(255,255,255,.15);
                ">
                    <img src="${img.src}" alt="${img.alt}"
                         style="width:100%;max-height:78vh;object-fit:contain;border-radius:12px;">
                    <p style="text-align:center;color:#c9b9c0;font:italic 22px 'Cormorant Garamond',serif;margin-top:12px;">
                        ${img.alt}
                    </p>
                </div>
            `;
            modal.classList.add("open");
            modal.setAttribute("aria-hidden","false");
        });
    });

    create?.addEventListener("click",()=>{
        if(!modal || !modalContent)return;

        modalContent.innerHTML=`
            <div class="letter-paper" style="text-align:center;">
                <span class="letter-small-title">MEMORY 03</span>
                <h3>Not created yet.</h3>
                <p>
                    This little space is waiting for the next photograph,
                    the next story, the next ridiculous moment...
                    whatever comes next for us. ♥
                </p>
                <span class="letter-signature">— Frank</span>
            </div>
        `;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden","false");
    });

    document.querySelectorAll(".modal-close").forEach(close=>{
        close.addEventListener("click",()=>{
            document.querySelectorAll(".modal").forEach(m=>{
                m.classList.remove("open");
                m.setAttribute("aria-hidden","true");
            });
        });
    });

    document.querySelectorAll(".modal").forEach(m=>{
        m.addEventListener("click",e=>{
            if(e.target===m){
                m.classList.remove("open");
                m.setAttribute("aria-hidden","true");
            }
        });
    });

    document.addEventListener("keydown",e=>{
        if(e.key==="Escape"){
            document.querySelectorAll(".modal").forEach(m=>m.classList.remove("open"));
        }
    });

    /* Future-proof helper:
       When you manually add another .memory-card containing an image,
       change this number or calculate it dynamically later. */
    if(count){
        count.textContent=document.querySelectorAll(".gallery-image").length;
    }
});
