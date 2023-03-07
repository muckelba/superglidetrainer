<script>
    import { onMount, afterUpdate } from "svelte";
    import { writable } from "svelte/store";
    import Faq from "../lib/components/Faq.svelte";
    import Footer from "../lib/components/Footer.svelte";
    import Tips from "../lib/components/Tips.svelte";

    // default settings
    const settings = writable({
        jump: " ",
        crouch: "Control",
        fps: 144,
    });

    let modalNotification = false;
    let assignWarning = false;
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
    let attempts = 0;
    let potentialSuperglides = 0;

    onMount(() => {
        // keep the scrollbar at the bottom
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }

        // load settings from localstorage
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
        // keep the scrollbar at the bottom
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }
    });

    function setSetting(setting) {
        function handleKeyDown(event) {
            event.preventDefault();
            const otherSetting = setting === "jump" ? "crouch" : "jump";
            const otherValue = $settings[otherSetting];

            if (event.key !== otherValue) {
                $settings[setting] = event.key;
                modalNotification = false;
                assignWarning = false;
                window.removeEventListener("keydown", handleKeyDown);
            } else {
                assignWarning = true;
            }
            event.target.blur();
        }

        if (!modalNotification) {
            modalNotification = true;
            window.addEventListener("keydown", handleKeyDown);
        } else {
            window.removeEventListener("keydown", handleKeyDown);
            modalNotification = false;
            settingActive = false;
        }
    }

    function toggleState() {
        this.blur(); // removes focus to disable activation by spacebar
        // reset to default values when stopping
        if (trainingActive) {
            instructions = "Waiting for jump input...";
            instructionColor = "";
            state = "ready";
            lastState = "ready";
            startTime = new Date();
            chance = 0;
        } else {
            history = [];
        }
        trainingActive = !trainingActive;
    }

    const superglide = (event) => {
        // only prevent default for the two set keys
        if ([$settings.jump, $settings.crouch].find((v) => event.key === v)) {
            event.preventDefault();
        }
        console.log(`Pressed key "${event.key}"`);
        if (lastState != state) {
            if (state === "jump") {
                instructions = "Press crouch";
                instructionColor = "";
            } else if (state === "ready") {
                instructions = "Press jump";
                instructionColor = "";
                attempts += 1;
            }
        }
        lastState = state;

        if (event.key === $settings.crouch) {
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
                    message = `Crouch later by XX frames (${differenceSeconds.toFixed(
                        5
                    )}s)`;
                } else if (elapsedFrames < 2) {
                    chance = (2 - elapsedFrames) * 100;
                    message = `Crouch sooner by XX frames (${(
                        differenceSeconds * -1
                    ).toFixed(5)}s)`;
                } else {
                    message = `Crouched too late by XX frames (${(
                        differenceSeconds * -1
                    ).toFixed(5)}s)`;
                    chance = 0;
                }

                history = [
                    ...history,
                    {
                        line: message,
                        color: "light",
                        finished: false,
                    },
                    {
                        line: `${elapsedFrames.toFixed(1)} frames have passed`,
                        color: "light",
                        finished: false,
                    },
                ];

                if (chance > 0) {
                    instructions = `${chance.toFixed(
                        5
                    )}% chance to hit the superglide`;
                    if (chance > 50) {
                        instructionColor = "success";
                        potentialSuperglides += 1;
                    } else if (chance > 25) {
                        instructionColor = "warning";
                    } else {
                        instructionColor = "danger";
                    }
                } else {
                    instructions = `0% chance to hit the superglide`;
                    instructionColor = "danger";
                }

                history = [
                    ...history,
                    {
                        line: instructions,
                        color: instructionColor,
                        finished: true,
                    },
                ];

                state = "ready";
            } else if (state === "crouch") {
                instructions = "Double Crouch Input, resetting";
                instructionColor = "danger";
                chance = 0;
                attempts -= 1;
                state = "ready";
            }
        } else if (event.key === $settings.jump) {
            if (state === "ready") {
                startTime = new Date();
                state = "jump";
            } else if (state === "jump") {
                state = "jumpwarned";
                instructions =
                    "Multiple jumps detected, results may not reflect ingame behavior.";
                instructionColor = "warning";
            } else if (state === "jumpwarned") {
                state = "jumpwarned";
            } else if (state === "crouch") {
                instructions = "You must jump before you crouch";
                instructionColor = "danger";
                history = [
                    ...history,
                    {
                        line: instructions,
                        color: instructionColor,
                        finished: false,
                    },
                ];

                const now = new Date();
                const delta = (now - startTime) / 1000 + frameTime;
                const earlyBy = delta / frameTime;

                chance = 0;

                history = [
                    ...history,
                    {
                        line: `Crouch later by ${earlyBy.toFixed(
                            2
                        )} frames (${delta.toFixed(5)}s)`,
                        color: "light",
                        finished: false,
                    },
                    {
                        line: "0% chance to hit the superglide",
                        color: "danger",
                        finished: true,
                    },
                ];

                state = "ready";
            }
        } else {
            instructions = "Other key pressed, ignoring";
            instructionColor = "warning";
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
    <div class="box">
        <blockquote>
            <p>
                A Superglide needs a jump input first and then a crouch input 1
                frame later. You need to do the whole Superglide in the last
                0.1-0.2 sec of a mantle.
            </p>
            <br />

            <p>
                That makes the correct timing of Jump -> Crouch way harder then
                timing the whole Superglide in the mantle. This trainer will
                help you learn that much harder Jump -> Crouch timing.
            </p>
        </blockquote>
    </div>
    <div class="container ">
        <div class="columns">
            <div class="column">
                <div class="box has-text-centered">
                    <h3 class="title is-3">
                        <span class="icon-text"
                            ><span class="icon"
                                ><i class="fas fa-dumbbell" /></span
                            >&nbsp;<span>Training</span></span
                        >
                    </h3>
                    <p class="subtitle">Click on the buttons to re-bind them</p>
                    <div class="field">
                        <div class="field-body">
                            <div class="field">
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
                            </div>
                            <div class="field">
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
                            <div class="field has-addons">
                                <p class="control">
                                    <button
                                        class="button is-link is-outlined no-hover"
                                    >
                                        FPS:
                                    </button>
                                </p>
                                <p class="control">
                                    <input
                                        class="input is-link is-outlined has-background-dark has-text-white"
                                        bind:value={$settings.fps}
                                        type="number"
                                        min="1"
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                    {#if modalNotification}
                        <div class="notification is-info">
                            Press a button you want to assign
                        </div>
                    {/if}
                    {#if assignWarning}
                        <div class="notification is-danger">
                            This key is already assigned
                        </div>
                    {/if}
                    {#if trainingActive}
                        <div class="notification is-{instructionColor}">
                            {instructions}
                        </div>
                        {#if message}
                            <div class="notification is-light">
                                {message}
                            </div>
                        {/if}
                    {/if}
                    <button
                        class="button is-medium is-fullwidth {trainingActive
                            ? 'is-danger'
                            : 'is-success'}"
                        on:click={toggleState}
                    >
                        {trainingActive ? "Stop" : "Start"}
                    </button>
                </div>
            </div>
            <div class="column">
                <div class="box">
                    <h3 class="title has-text-centered is-3">
                        <span class="icon-text"
                            ><span class="icon"
                                ><i class="fas fa-chart-bar" /></span
                            >&nbsp;<span>Analytics</span></span
                        >
                    </h3>
                    <div class="columns">
                        <div class="column">
                            <p>Attempts: <code> {attempts}</code></p>
                            <p>
                                Potential superglides: <code
                                    >{(
                                        (potentialSuperglides / attempts) *
                                            100 || 0
                                    ).toFixed(2)}%</code
                                >
                            </p>
                            <p>Average chance: <code>68%</code></p>
                            <p>
                                Overall superglide concistency: <code>95%</code>
                            </p>
                            <br />
                            <p>You got <code>0%</code> because:</p>
                            <p>Wrong input first: <code>12%</code></p>
                            <p>Crouch too late: <code>78%</code></p>
                            <br />
                            <p>
                                On a potential superglide your crouch is too
                                late by
                                <code>0.0134ms</code> or <code>0.4FPS</code> on average
                            </p>
                        </div>
                        <div class="divider is-vertical" />
                        <div class="column history" bind:this={historydiv}>
                            {#each history as { line, color, finished }}
                                <p>
                                    <span class="tag is-{color}">{line}</span>
                                </p>
                                {#if finished}
                                    <div class="divider" />
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br />
    <Tips />
    <br />
    <Faq />
</section>
<Footer />
