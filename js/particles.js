/* ============================================================
   FRANK × IVY
   Romantic Interactive Particle System
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const field = document.getElementById("particle-field");

    if (!field) return;


    /* ========================================================
       SETTINGS
       ======================================================== */

    const PARTICLE_COUNT = 85;

    const particles = [];

    let pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        active: false
    };

    let scrollPower = 0;


    /* ========================================================
       PARTICLE TYPES
       ======================================================== */

    const types = [
        "dot",
        "dot",
        "dot",
        "heart",
        "heart",
        "spark",
        "orb",
        "bubble"
    ];


    /* ========================================================
       CREATE PARTICLE
       ======================================================== */

    function createParticle() {

        const el = document.createElement("span");

        const type =
            types[
                Math.floor(
                    Math.random() * types.length
                )
            ];

        el.className =
            `romantic-particle particle-${type}`;

        if (type === "heart") {

            el.textContent =
                Math.random() > .5
                    ? "♥"
                    : "♡";

        }

        else if (type === "spark") {

            el.textContent = "✦";

        }

        else if (type === "bubble") {

            el.textContent = "";

        }

        else {

            el.textContent = "";

        }


        /* Position */

        const x =
            Math.random() *
            window.innerWidth;

        const y =
            Math.random() *
            window.innerHeight;


        /* Depth */

        const depth =
            .25 +
            Math.random() * .9;


        const particle = {

            el,

            x,

            y,

            vx:
                (Math.random() - .5)
                * .25
                * depth,

            vy:
                (
                    -.05 -
                    Math.random() * .3
                )
                * depth,

            depth,

            size:
                2 +
                Math.random() * 5,

            rotation:
                Math.random() * 360,

            rotationSpeed:
                (Math.random() - .5)
                * 1.5,

            life:
                Math.random(),

            pulse:
                Math.random() * Math.PI * 2,

            type
        };


        /* Size */

        if (type === "heart") {

            particle.size =
                10 +
                Math.random() * 15;

        }

        if (type === "spark") {

            particle.size =
                10 +
                Math.random() * 14;

        }

        if (type === "orb") {

            particle.size =
                10 +
                Math.random() * 22;

        }


        el.style.fontSize =
            particle.size + "px";


        field.appendChild(el);

        particles.push(particle);
    }


    /* ========================================================
       INITIAL PARTICLES
       ======================================================== */

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        createParticle();

    }


    /* ========================================================
       POINTER
       ======================================================== */

    function updatePointer(x, y) {

        pointer.x = x;

        pointer.y = y;

        pointer.active = true;

    }


    window.addEventListener(
        "mousemove",
        event => {

            updatePointer(
                event.clientX,
                event.clientY
            );

        },
        { passive: true }
    );


    window.addEventListener(
        "touchmove",
        event => {

            const touch =
                event.touches[0];

            if (!touch) return;

            updatePointer(
                touch.clientX,
                touch.clientY
            );

        },
        { passive: true }
    );


    /* ========================================================
       HEART BURST
       ======================================================== */

    function heartBurst(x, y) {

        for (
            let i = 0;
            i < 14;
            i++
        ) {

            const heart =
                document.createElement("span");

            heart.className =
                "burst-heart";

            heart.textContent =
                Math.random() > .25
                    ? "♥"
                    : "✦";


            const angle =
                Math.random() *
                Math.PI * 2;

            const distance =
                70 +
                Math.random() * 130;


            heart.style.left =
                x + "px";

            heart.style.top =
                y + "px";


            heart.style.setProperty(
                "--dx",
                Math.cos(angle) *
                distance +
                "px"
            );

            heart.style.setProperty(
                "--dy",
                Math.sin(angle) *
                distance +
                "px"
            );


            field.appendChild(heart);


            setTimeout(() => {

                heart.remove();

            }, 1200);

        }


        createRipple(x, y);

    }


    /* ========================================================
       RIPPLE
       ======================================================== */

    function createRipple(x, y) {

        const ripple =
            document.createElement("span");

        ripple.className =
            "particle-ripple";

        ripple.style.left =
            x + "px";

        ripple.style.top =
            y + "px";


        field.appendChild(ripple);


        setTimeout(() => {

            ripple.remove();

        }, 1000);

    }


    /* ========================================================
       TOUCH / CLICK
       ======================================================== */

    window.addEventListener(
        "pointerdown",
        event => {

            heartBurst(
                event.clientX,
                event.clientY
            );

        }
    );


    /* ========================================================
       SCROLL ENERGY
       ======================================================== */

    let previousScroll =
        window.scrollY;


    window.addEventListener(
        "scroll",
        () => {

            const current =
                window.scrollY;

            scrollPower =
                current -
                previousScroll;

            previousScroll =
                current;

        },
        { passive: true }
    );


    /* ========================================================
       ANIMATION
       ======================================================== */

    let lastTime =
        performance.now();


    function animate(time) {

        const delta =
            Math.min(
                32,
                time - lastTime
            );

        lastTime = time;


        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        particles.forEach(
            particle => {

                /* --------------------------------------------
                   Natural floating motion
                   -------------------------------------------- */

                particle.pulse +=
                    .01 *
                    particle.depth *
                    delta;


                particle.x +=
                    particle.vx *
                    delta;

                particle.y +=
                    particle.vy *
                    delta;


                /* --------------------------------------------
                   Sinusoidal drifting
                   -------------------------------------------- */

                particle.x +=
                    Math.sin(
                        particle.pulse
                    )
                    *
                    .12
                    *
                    particle.depth;


                particle.y +=
                    Math.cos(
                        particle.pulse * .7
                    )
                    *
                    .08
                    *
                    particle.depth;


                /* --------------------------------------------
                   Scroll reaction
                   -------------------------------------------- */

                particle.y -=
                    scrollPower *
                    particle.depth *
                    .15;


                /* --------------------------------------------
                   Mouse interaction
                   -------------------------------------------- */

                if (pointer.active) {

                    const dx =
                        pointer.x -
                        particle.x;

                    const dy =
                        pointer.y -
                        particle.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    const radius =
                        180;


                    if (
                        distance < radius &&
                        distance > 0
                    ) {

                        const force =
                            (radius -
                                distance)
                            / radius;


                        /*
                         * Hearts are attracted.
                         * Other particles are
                         * gently pushed away.
                         */

                        if (
                            particle.type ===
                            "heart"
                        ) {

                            particle.vx +=
                                (dx / distance)
                                *
                                force
                                *
                                .025;

                            particle.vy +=
                                (dy / distance)
                                *
                                force
                                *
                                .025;

                        }

                        else {

                            particle.vx -=
                                (dx / distance)
                                *
                                force
                                *
                                .018;

                            particle.vy -=
                                (dy / distance)
                                *
                                force
                                *
                                .018;

                        }

                    }

                }


                /* --------------------------------------------
                   Gentle friction
                   -------------------------------------------- */

                particle.vx *= .995;

                particle.vy *= .995;


                /* --------------------------------------------
                   Screen wrapping
                   -------------------------------------------- */

                if (
                    particle.x <
                    -50
                ) {

                    particle.x =
                        width + 50;

                }

                if (
                    particle.x >
                    width + 50
                ) {

                    particle.x =
                        -50;

                }


                if (
                    particle.y <
                    -60
                ) {

                    particle.y =
                        height + 60;

                }

                if (
                    particle.y >
                    height + 60
                ) {

                    particle.y =
                        -60;

                }


                /* --------------------------------------------
                   Rotation
                   -------------------------------------------- */

                particle.rotation +=
                    particle.rotationSpeed;


                /* --------------------------------------------
                   Pulse
                   -------------------------------------------- */

                const pulse =
                    1 +
                    Math.sin(
                        particle.pulse
                    )
                    *
                    .15;


                /* --------------------------------------------
                   Render
                   -------------------------------------------- */

                particle.el.style.transform = `
                    translate3d(
                        ${particle.x}px,
                        ${particle.y}px,
                        0
                    )
                    rotate(
                        ${particle.rotation}deg
                    )
                    scale(${pulse})
                `;


                particle.el.style.opacity =
                    .25 +
                    particle.depth *
                    .65;

            }
        );


        /*
         * Slowly decay scroll force
         */

        scrollPower *= .9;


        requestAnimationFrame(
            animate
        );

    }


    requestAnimationFrame(
        animate
    );


    /* ========================================================
       INJECT PARTICLE CSS
       ======================================================== */

    const style =
        document.createElement("style");


    style.textContent = `

        .romantic-particle {

            position: absolute;

            pointer-events: none;

            user-select: none;

            will-change:
                transform,
                opacity;

        }


        .particle-dot {

            width: 4px;

            height: 4px;

            border-radius: 50%;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .8
                );

            box-shadow:
                0 0 8px
                rgba(
                    105,
                    201,
                    255,
                    .8
                );

        }


        .particle-heart {

            color:
                rgba(
                    255,
                    49,
                    91,
                    .9
                );

            text-shadow:

                0 0 8px
                rgba(
                    255,
                    49,
                    91,
                    .8
                ),

                0 0 25px
                rgba(
                    255,
                    49,
                    91,
                    .4
                );

        }


        .particle-spark {

            color:
                rgba(
                    184,
                    233,
                    255,
                    .95
                );

            text-shadow:

                0 0 10px
                rgba(
                    105,
                    201,
                    255,
                    .9
                ),

                0 0 30px
                rgba(
                    105,
                    201,
                    255,
                    .6
                );

        }


        .particle-orb {

            width: 18px;

            height: 18px;

            border-radius: 50%;

            background:

                radial-gradient(
                    circle at 35% 30%,
                    rgba(
                        255,
                        255,
                        255,
                        .75
                    ),

                    rgba(
                        105,
                        201,
                        255,
                        .25
                    )
                );

            filter:
                blur(1px);

            box-shadow:

                0 0 25px
                rgba(
                    105,
                    201,
                    255,
                    .45
                );

        }


        .particle-bubble {

            width: 12px;

            height: 12px;

            border-radius: 50%;

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .25
                );

            background:
                rgba(
                    255,
                    255,
                    255,
                    .035
                );

            box-shadow:
                inset 2px 2px
                rgba(
                    255,
                    255,
                    255,
                    .18
                );

        }


        .burst-heart {

            position: absolute;

            z-index: 50;

            pointer-events: none;

            color:
                #ff315b;

            font-size:
                ${12 + Math.random()*18}px;

            text-shadow:

                0 0 10px
                rgba(
                    255,
                    49,
                    91,
                    .9
                ),

                0 0 30px
                rgba(
                    255,
                    49,
                    91,
                    .5
                );

            animation:
                burstHeart
                1.1s
                cubic-bezier(
                    .15,
                    .8,
                    .25,
                    1
                )
                forwards;

        }


        @keyframes burstHeart {

            0% {

                opacity: 0;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(.2)
                    rotate(0deg);

            }

            15% {

                opacity: 1;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(1.4);

            }

            100% {

                opacity: 0;

                transform:
                    translate(
                        calc(
                            var(--dx) -
                            50%
                        ),
                        calc(
                            var(--dy) -
                            50%
                        )
                    )
                    scale(.5)
                    rotate(220deg);

            }

        }


        .particle-ripple {

            position: absolute;

            width: 20px;

            height: 20px;

            margin:
                -10px;

            border-radius: 50%;

            border:
                1px solid
                rgba(
                    255,
                    49,
                    91,
                    .7
                );

            box-shadow:

                0 0 25px
                rgba(
                    255,
                    49,
                    91,
                    .4
                );

            animation:
                particleRipple
                1s
                ease-out
                forwards;

        }


        @keyframes particleRipple {

            0% {

                opacity: 1;

                transform:
                    scale(.2);

            }

            100% {

                opacity: 0;

                transform:
                    scale(12);

            }

        }

    `;


    document.head.appendChild(style);

});