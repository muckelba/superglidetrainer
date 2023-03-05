<script>
    import { onMount, afterUpdate } from "svelte";
    import { writable } from "svelte/store";

    const settings = writable({
        jump: " ",
        crouch: "Control",
        fps: 144,
    });

    let modal = false;
    let trainingActive = false;
    let settingActive = false;
    $: frameTime = 1 / $settings.fps;
    let instructions = "Waiting for jump input...";
    let instructionColor = "";
    let message = "";
    let history = [];
    let historydiv;
    let state = "ready";
    let lastState = "ready";
    let startTime = new Date();
    let chance = 0;

    onMount(() => {
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }
        const content = localStorage.getItem("content");
        if (content) {
            $settings = JSON.parse(content);
        }

        const unsubscribe = settings.subscribe((value) => {
            localStorage.setItem("content", JSON.stringify(value));
        });

        return unsubscribe;
    });

    afterUpdate(() => {
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }
    });

    function setSetting(setting) {
        modal = true;
        if (!settingActive) {
            window.addEventListener(
                "keydown",
                (event) => {
                    handleKeyDown(event, setting);
                },
                { once: true }
            );
        } else {
            modal = false;
        }
    }

    function handleKeyDown(event, setting) {
        event.preventDefault();
        $settings[setting] = event.key;
        modal = false;
        event.target.blur();
    }

    function toggleState() {
        this.blur(); // removes focus to disable activation by spacebar
        // reset to default values when stopping
        if (trainingActive) {
            instructions = "Waiting for jump input...";
            instructionColor = "";
            history = [];
            state = "ready";
            lastState = "ready";
            startTime = new Date();
            chance = 0;
        }
        trainingActive = !trainingActive;
    }

    const superglide = (event) => {
        event.preventDefault();
        console.log(`Pressed key "${event.key}"`);
        if (lastState != state) {
            if (state === "jump") {
                instructions = "Press crouch";
                instructionColor = "";
            } else if (state === "ready") {
                instructions = "Press jump";
                instructionColor = "";
            }
            lastState = state;
        }

        if (event.key === $settings.crouch) {
            history = [
                ...history,
                { line: "crouch pressed", color: "success", finished: false },
            ];
            let elapsedFrames = new Date();
            let differenceSeconds = 0;
            if (state === "ready") {
                startTime = new Date();
                state = "crouch";
            } else if (state === "jump" || state == "jumpwarned") {
                const now = new Date();
                const calucated = (now.getTime() - startTime.getTime()) / 1000;
                elapsedFrames = calucated / frameTime;
                differenceSeconds = frameTime - calucated;

                if (elapsedFrames < 1) {
                    chance = elapsedFrames * 100;
                    message = `Crouch slightly <strong>later</strong> by <code>${differenceSeconds.toFixed(
                        5
                    )}</code> seconds to improve`;
                } else if (elapsedFrames < 2) {
                    chance = (2 - elapsedFrames) * 100;
                    message = `Crouch slightly <strong>sooner</strong> by <code>${(
                        differenceSeconds * -1
                    ).toFixed(5)}</code> seconds to improve`;
                } else {
                    message = `Crouched too late by <code>${(
                        differenceSeconds * -1
                    ).toFixed(5)}</code> seconds`;
                    chance = 0;
                }

                history = [
                    ...history,
                    {
                        line: `${elapsedFrames.toFixed(1)} frames have passed`,
                        color: "light",
                        finished: true,
                    },
                ];

                if (chance > 0) {
                    instructions = `<code>${chance.toFixed(
                        5
                    )}%</code> chance to hit the superglide`;
                    if (chance > 50) {
                        instructionColor = "is-success";
                    } else if (chance > 25) {
                        instructionColor = "is-warning";
                    } else {
                        instructionColor = "is-danger";
                    }
                } else {
                    instructions = `<code>0%</code> chance to hit`;
                    instructionColor = "is-danger";
                }

                state = "ready";
            } else if (state === "crouch") {
                instructions = "Double Crouch Input, resetting";
                instructionColor = "is-danger";
                chance = 0;
                state = "ready";
            }
        } else if (event.key === $settings.jump) {
            history = [
                ...history,
                { line: "jump pressed", color: "success", finished: false },
            ];
            if (state === "ready") {
                startTime = new Date();
                state = "jump";
            } else if (state === "jump") {
                state = "jumpwarned";
                instructions =
                    "Warning: Multiple jumps detected, results may not reflect ingame behavior.";
                instructionColor = "is-warning";
            } else if (state === "jumpwarned") {
                state = "jumpwarned";
            } else if (state === "crouch") {
                instructions = "You must jump before you crouch";
                instructionColor = "is-danger";
                const now = new Date();
                const delta = (now - startTime) / 1000 + frameTime;
                const earlyBy = delta / frameTime;

                chance = 0;

                history = [
                    ...history,
                    {
                        line: `Press crouch later by ${earlyBy.toFixed(
                            2
                        )} frames (${delta.toFixed(5)}s)`,
                        color: "light",
                        finished: true,
                    },
                ];

                state = "ready";
            }
        } else {
            instructions = "Other key pressed, ignoring";
            instructionColor = "is-warning";
        }
    };
</script>

<svelte:head>
    <title>Apex Legends Superglide Trainer</title>
    <meta property="og:title" content="Apex Legends Superglide Trainer" />
    <meta
        property="og:description"
        content="Train your superglide timings here!"
    />
    <meta
        property="og:url"
        content="https://muckelba.github.io/superglidetrainer/"
    />
    <meta property="og:type" content="website" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
    />
</svelte:head>

<svelte:window
    on:keydown={(event) => {
        if (trainingActive) {
            superglide(event);
        }
    }}
/>

<section class="section">
    <h1 class="title is-1">Apex Legends Superglide Trainer</h1>
    <h2 class="subtitle is-6">
        A Superglide needs a jump input first and then a crouch input 1 frame
        later.
        <br /> You need to do the whole Superglide in the last 0.1-0.2 sec of a
        mantle. <br /> <br />That makes the correct timing of Jump -> Crouch way
        harder then timing the whole Superglide in the Mantle.
        <br />This Trainer will help you hit that much harder Jump-> Crouch
        timing.
    </h2>
</section>

<section class="section">
    <div class="tile is-ancestor">
        <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box">
                <h3 class="title is-3">
                    <span class="icon-text"
                        ><span class="icon"><i class="fas fa-cogs" /></span
                        >&nbsp;<span>Settings</span></span
                    >
                </h3>
                <p class="subtitle">Click on the buttons to re-bind them</p>
                <div class="field is-grouped">
                    <p class="control">
                        <button
                            class="button is-link is-outlined"
                            on:click={() => setSetting("jump")}
                        >
                            Jump:&nbsp;<span class="tag"
                                >{$settings.jump === " "
                                    ? "SPACE"
                                    : $settings.jump.toUpperCase()}</span
                            >
                        </button>
                    </p>
                    <p class="control">
                        <button
                            class="button is-link is-outlined"
                            on:click={() => setSetting("crouch")}
                        >
                            Crouch:&nbsp;<span class="tag"
                                >{$settings.crouch === " "
                                    ? "SPACE"
                                    : $settings.crouch.toUpperCase()}</span
                            >
                        </button>
                    </p>
                </div>

                <p>
                    FPS: <input
                        class="input is-link is-outlined"
                        bind:value={$settings.fps}
                        type="number"
                        min="0"
                    />
                </p>

                {#if modal}
                    <div class="">Press a button you want to assign</div>
                {/if}
            </div>
        </div>
        <div class="tile is-parent">
            <div class="tile is-child box">
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <h3 class="title is-3">
                            <span class="icon-text"
                                ><span class="icon"
                                    ><i class="fas fa-dumbbell" /></span
                                >&nbsp;<span>Training</span></span
                            >
                        </h3>
                    </div>

                    <div class="navbar-end">
                        <p class="control">
                            <button
                                class="button {trainingActive
                                    ? 'is-danger'
                                    : 'is-success'}"
                                on:click={toggleState}
                            >
                                {trainingActive ? "Stop" : "Start"}
                            </button>
                        </p>
                    </div>
                </div>
                {#if trainingActive}
                    <div class="columns">
                        <div
                            class="column is-one-third"
                            bind:this={historydiv}
                            style="height:200px; overflow:auto; flex-direction: column-reverse;"
                        >
                            {#each history as { line, color, finished }}
                                <p class="history">
                                    <span class="tag is-{color}">{line}</span>
                                </p>
                                {#if finished}
                                    <hr />
                                {/if}
                            {/each}
                        </div>
                        <div class="column">
                            <div
                                class="notification is-light {instructionColor}"
                            >
                                {@html instructions}
                            </div>
                            {#if message}
                                <div class="notification is-light">
                                    {@html message}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</section>
<section class="section">
    <h1 class="title is-3">Helpful Tips to get better</h1>
    <div class="content">
        <h5 class="title is-5">
            Get better at hitting the Jump -> Crouch Timing
        </h5>
        <strong>Mouse and Keyboard:</strong>
        <ol type="1">
            <li>
                It's common to put your crouch on a button next to your jump
                input, so you can press them both with 1 finger at the same
                time. <code>C</code>,<code>V</code> or <code>B</code> with spacebar
                for example.
            </li>
            <li>
                Different keycap profiles will naturally alter which button you
                hit first. So flipping over your crouch keycap can help. As well
                as getting different keycaps. Or taping stuff to your existing
                keycaps.
            </li>
            <li>Some folks have seen success by jumping with Scrollwheel.</li>
            <li>
                Your keyboard switches will also alter when a key is activated.
                Tactile switches like MX blues make it much easier to feel the
                activation point, and putting different switches on your <code
                    >C</code
                >,<code>V</code> and <code>B</code> then on Spacebar might help with
                activation as well. The Ultimate Hardware Change would be to get
                a Keyboard with activation points you can change. Like from Wooting
                or the Apex Mini Pro from Steelseries.
            </li>
        </ol>
        <strong>Controller:</strong> <br />
        For controller the eastiest way is to press either A+B with one finger or
        X+Square with one finger.
    </div>
    <div class="content">
        <h5 class="title is-5">
            Get better at timing the Superglide during the Mantle
        </h5>
        <div class="subtitle is-6">
            <ul>
                <li>Audio cue</li>
                <li>Camera Shake</li>
            </ul>
            If you don't gain any Speed you hit the Superglide to early. If you jump
            of the ledge with speed but not a Superglide you hit it too late.
        </div>
    </div>
</section>
<section class="section">
    <h1 class="title is-3">FAQ</h1>
    <div class="content">
        <h5 class="title is-5">What is a Superglide?</h5>
        <p class="subtitle is-6">
            A Superglide is an instant 1 Frame acceleration out of a Mantle. It
            needs a jump input first and then a crouch input 1 frame later. You
            need to do the whole Superglide in the last 0.1-0.2 sec of a Mantle,
            that makes the correct timing of the whole Superglide way easier
            then the correct timing of jump -> crouch. That's what this Trainer
            is for.
        </p>
    </div>
    <div class="content">
        <h5 class="title is-5">
            Why is there a Chance? I thought it just needed Frame perfect
            inputs?
        </h5>
        <p class="subtitle is-6">
            Because of the way Apex handles Input data, you might have timed
            your jump and crouch input very close to 1 FPS apart. But they might
            still be processed by the engine on the same Frame. Or 2 Frames
            apart. When it only works when they are processed 1 Frame apart.
            That is also the reason why the feedback can say to crouch later or
            sooner. Because of that randomness you can never reach 100%
            Superglide consistency. Max is 99%. Here is a fantastic video
            explaining the exact same Problem in Titanfall 2:
        </p>
        <p>
            <iframe
                class="has-ratio"
                width="560"
                height="315"
                src="https://www.youtube-nocookie.com/embed/Cwa0qbDx2dA?start=423"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            />
        </p>
    </div>
    <div class="content">
        <h5 class="title is-5">
            Do you have tips to better time the superglide during the mantle?
        </h5>
        <p class="subtitle is-6">yadadadad</p>
    </div>
    <div class="content">
        <h5 class="title is-5">Who made this Trainer?</h5>
        <p class="subtitle is-6">
            This website is made by <a href="https://github.com/muckelba"
                >@muckelba</a
            >
            and based on a
            <a
                href="https://github.com/AngryGroceries/Apex_Superglide_Practice_Tool"
                >powershell script</a
            >
            that
            <a href="https://github.com/AngryGroceries">@AngryGroceries</a> and
            <a href="https://github.com/JayTheYggdrasil">@JayTheYggdrasil</a>
            made.
        </p>
    </div>
</section>
