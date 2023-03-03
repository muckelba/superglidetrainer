<script>
    import { onMount } from "svelte";
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
    let instructions = "Lets go";
    let state = "ready";
    let lastState = "jump";
    let startTime = new Date();
    let chance = 0;

    onMount(() => {
        const content = localStorage.getItem("content");
        if (content) {
            $settings = JSON.parse(content);
        }

        const unsubscribe = settings.subscribe((value) => {
            localStorage.setItem("content", JSON.stringify(value));
        });

        return unsubscribe;
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
            instructions = "Press jump to begin";
            state = "ready";
            lastState = "jump";
            startTime = new Date();
            chance = 0;
        }
        trainingActive = !trainingActive;
    }

    const superglide = (event) => {
        console.log(`Pressed key "${event.key} state: ${state}"`);
        if (lastState != state) {
            if (state === "jump") {
                instructions = "Press crouch";
            } else if (state === "ready") {
                instructions = "Press jump";
            }
            lastState = state;
        }

        if (event.key === $settings.crouch) {
            console.log("crouch pressed");
            let elapsedFrames = new Date();
            let differenceSeconds = 0;
            let message = "";
            if (state === "ready") {
                startTime = new Date();
                state = "crouch";
            } else if (state === "jump" || state == "jumpwarned") {
                const now = new Date();
                const calucated = (now.getTime() - startTime.getTime()) / 1000;
                elapsedFrames = calucated / frameTime;
                differenceSeconds = frameTime - calucated;
                console.log(calucated);
                console.log(frameTime);
                console.log(elapsedFrames);
                console.log(differenceSeconds);

                if (elapsedFrames < 1) {
                    chance = elapsedFrames * 100;
                    message = `Crouch slightly *later* by ${differenceSeconds} seconds to improve`;
                } else if (elapsedFrames < 2) {
                    chance = (2 - elapsedFrames) * 100;
                    message = `Crouch slightly *sooner* by ${
                        differenceSeconds * -1
                    } seconds to improve`;
                } else {
                    message = `Crouched too late by ${
                        differenceSeconds * -1
                    } seconds`;
                    chance = 0;
                }

                console.log(`${elapsedFrames} frames have passed`);

                if (chance > 0) {
                    instructions = `${chance}% chance to hit`;
                } else {
                    instructions = `0% chance to hit`;
                }

                console.log(message);
                state = "ready";
            } else if (state === "crouch") {
                instructions = "Double Crouch Input, resetting";
                chance = 0;
                state = "ready";
            }
        } else if (event.key === $settings.jump) {
            console.log("jump pressed");
            if (state === "ready") {
                startTime = new Date();
                state = "jump";
            } else if (state === "jump") {
                state = "jumpwarned";
                instructions =
                    "Warning: Multiple jumps detected, results may not reflect ingame behavior.";
            } else if (state === "jumpwarned") {
                state = "jumpwarned";
            } else if (state === "crouch") {
                instructions = "You must jump before you crouch";
                const now = new Date();
                const delta = (now - startTime) / 1000 + frameTime;
                const earlyBy = delta / frameTime;

                chance = 0;

                console.log(
                    `Press crouch later by ${earlyBy} frames (${delta}s)`
                );
                state = "ready";
            }
        } else {
            instructions = "Other key pressed, ignoring";
        }
    };
</script>

<svelte:head>
    <title>Superglide Trainer</title>
    <meta property="og:title" content="Superglide Trainer" />
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
    <div class="container">
        <h1 class="title">Superglide Trainer</h1>
        <p class="subtitle">
            Jump and crouch must be exactly 1 frame apart for the highest chance
            at superglide success.
        </p>
    </div>
</section>

<section class="section">
    <div class="columns">
        <div class="column is-narrow">
            <div class="box" style="width: 400px;">
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
        <div class="column">
            <div class="box">
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
                    <div>{instructions}</div>
                {/if}
            </div>
        </div>
    </div>
</section>
