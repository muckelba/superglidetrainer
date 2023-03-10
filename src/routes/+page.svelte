<script>
    import { onMount, afterUpdate } from "svelte";
    import { writable } from "svelte/store";
    import { siteDomain } from "../lib/config";
    import Faq from "../lib/components/Faq.svelte";
    import Footer from "../lib/components/Footer.svelte";
    import Tips from "../lib/components/Tips.svelte";

    const devices = {
        Keyboard: "keyboard",
        Mouse: "mouse",
        Wheel: "wheel",
    };
    // default settings
    const settings = writable({
        jump: { type: devices.Keyboard, bind: " " },
        crouch: { type: devices.Keyboard, bind: "Control" },
        fps: 144,
    });

    const states = {
        Ready: "ready", // Initial State
        Jump: "jump", // Partial Sequence
        JumpWarned: "jumpwarned", // Multi-Jump Warning Sent
        Crouch: "crouch", // Incorrect Sequence, let it play out for a bit
    };
    const events = {
        Keydown: "keydown",
        Mousedown: "mousedown",
        Wheel: "wheel",
        Popstate: "popstate",
    };

    let inputListeners = []
    let modalNotification = false;
    let assignWarning = false;
    let trainingActive = false;
    let settingActive = false;
    $: frameTime = 1 / $settings.fps;
    let instructions = "";
    let instructionColor = "";
    let superglideText = "";
    let superglideTextColor = "";
    let message = "";
    let history = [];
    let historydiv;
    let state = states.Ready;
    let lastState = states.Jump;
    let startTime = new Date();
    let chance = 0;
    let attempts = [];
    let potentialSuperglides = [];
    $: potentialSuperglidesPercentage =
        (potentialSuperglides.length / attempts.length) * 100 || 0;
    $: potentialSum = potentialSuperglides.reduce((a, b) => a + b, 0);
    $: potentialAvg = potentialSum / potentialSuperglides.length || 0;
    $: superglideConsistency = potentialSum / attempts.length || 0;
    let wrongInputCount = 0;
    let crouchTooLateCount = 0;
    $: wrongInputPercentage = (wrongInputCount / attempts.length) * 100 || 0;
    $: crouchTooLatePercentage =
        (crouchTooLateCount / attempts.length) * 100 || 0;

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

        // Only enable tracking for prod
        if (window.location.origin === siteDomain) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://umami.anton.wtf/umami.js";
            script.defer = true;
            script.async = true;
            script.setAttribute(
                "data-website-id",
                "4e7c534d-4079-424b-aef5-cd74274718dc"
            );
            document.head.appendChild(script);
        }

        return unsubscribe;
    });

    afterUpdate(() => {
        // keep the scrollbar at the bottom
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }
    });

    $: prettyBind = (setting) => {
        let buttonText = "";
        switch ($settings[setting].type) {
            case devices.Keyboard:
                buttonText =
                    $settings[setting].bind === " "
                        ? "SPACE"
                        : $settings[setting].bind.toUpperCase();
                break;
            case devices.Mouse:
                buttonText = `Mousebutton ${$settings[setting].bind}`;
                break;
            case devices.Wheel:
                buttonText = `Mousewheel ${
                    $settings[setting].bind > 0 ? "DOWN" : "UP"
                }`;
                break;
            default:
                break;
        }

        const icon_map = {
            keyboard: "keyboard",
            mouse: "mouse",
            wheel: "mouse",
        };
        const icon_class = `fas fa-${icon_map[$settings[setting].type]}`;
        return `${buttonText}&nbsp;&nbsp;<span class="icon">
                    <i class="${icon_class}"></i>
                </span>
                `;
    };

    // always go to the first forward history, which does not exist.
    function disableHistory() {
        window.history.go(1);
    }

    function toggleState() {
        trainingActive = !trainingActive;
        // removes focus to disable activation by spacebar
        this.blur();
        // reset to default values when stopping
        if (!trainingActive) {
            window.removeEventListener(events.Popstate, disableHistory);
            console.log(inputListeners)
            window.removeEventListener(inputListeners[0][0], inputListeners[0][1]);
            window.removeEventListener(inputListeners[1][0], inputListeners[1][1]);
            inputListeners = []
        } else {
            // clear forward history
            window.history.pushState(null, null, window.location.href);
            window.addEventListener(events.Popstate, disableHistory);
            message = "";
            superglideText = "";
            superglide();
        }
    }

    function getOtherKey(setting) {
        const otherSetting = setting === "jump" ? "crouch" : "jump";
        return $settings[otherSetting].bind;
    }

    function setSetting(setting) {
        function removeListeners() {
            window.removeEventListener(events.Keydown, handleKeyboard);
            window.removeEventListener(events.Mousedown, handleMouse);
            window.removeEventListener(events.Wheel, handleWheel);
        }

        function handleKeyboard(event) {
            event.preventDefault();

            if (event.key !== getOtherKey(setting)) {
                $settings[setting].type = devices.Keyboard;
                $settings[setting].bind = event.key;
                modalNotification = false;
                assignWarning = false;
                removeListeners();
            } else {
                assignWarning = true;
            }
            event.target.blur();
        }

        function handleMouse(event) {
            event.preventDefault();

            if (event.button !== getOtherKey(setting)) {
                $settings[setting].type = devices.Mouse;
                $settings[setting].bind = event.button;
                modalNotification = false;
                assignWarning = false;
                removeListeners();
            } else {
                assignWarning = true;
            }
            event.target.blur();
        }

        function handleWheel(event) {
            event.preventDefault();
            if (event.button !== getOtherKey(setting)) {
                $settings[setting].type = devices.Wheel;
                $settings[setting].bind = Math.sign(event.deltaY);
                modalNotification = false;
                assignWarning = false;
                removeListeners();
            } else {
                assignWarning = true;
            }
            event.target.blur();
        }

        if (!modalNotification) {
            modalNotification = true;
            window.addEventListener(events.Keydown, handleKeyboard);
            window.addEventListener(events.Mousedown, handleMouse);
            window.addEventListener(events.Wheel, handleWheel, {
                passive: false,
            });
            // Unable to preventDefault in passive event listner, which causes page to scroll down when binding it to the input.
            // https://chromestatus.com/feature/6662647093133312
        } else {
            removeListeners();
            modalNotification = false;
            settingActive = false;
        }
    }

    function get_device_props(device_type, e = null) {
        switch (device_type) {
            case devices.Keyboard:
                return [events.Keydown, e?.key];
            case devices.Mouse:
                return [events.Mousedown, e?.button];
            case devices.Wheel:
                return [events.Wheel, Math.sign(e?.deltaY)];
        }
    }

    function waitingKeypress() {
        const devices = [$settings.jump.type, $settings.crouch.type];
        inputListeners = []
        return new Promise((resolve) => {
            devices.forEach((dev) => {
                const [event_name, _] = get_device_props(dev, null);
                window.addEventListener(event_name, onEventHandler, {
                    passive: false,
                });
                function onEventHandler(e) {
                    window.removeEventListener(event_name, onEventHandler);
                    const [_, return_value] = get_device_props(dev, e);
                    // only prevent default for the two set keys (only works for keyboard events)
                    if (
                        return_value === $settings.jump.bind ||
                        return_value === $settings.crouch.bind
                    ) {
                        e.preventDefault();
                    }
                    resolve(return_value);
                }
                inputListeners.push([event_name,onEventHandler])
            });
        });
    }

    async function superglide() {
        while (trainingActive) {
            if (lastState !== state) {
                if (state === states.Jump) {
                    instructions = "Press crouch";
                    instructionColor = "";
                } else if (state === states.Ready) {
                    instructions = "Press jump";
                    instructionColor = "";
                }
            }

            lastState = state;
            let key = await waitingKeypress();
            console.log(`Pressed key "${key}"`);

            if (key === $settings.crouch.bind) {
                if (state === states.Ready) {
                    // startTime = new Date();
                    state = states.Crouch;
                } else if (
                    state === states.Jump ||
                    state === states.JumpWarned
                ) {
                    const now = new Date();
                    const calucated =
                        (now.getTime() - startTime.getTime()) / 1000;
                    const elapsedFrames = calucated / frameTime;
                    const differenceSeconds = frameTime - calucated;
                    const lateBy = Math.abs(1 - elapsedFrames);

                    if (elapsedFrames < 1) {
                        chance = elapsedFrames * 100;
                        message = `Crouch later by ${lateBy.toFixed(
                            1
                        )} frames (${differenceSeconds.toFixed(5)}s)`;
                    } else if (elapsedFrames < 2) {
                        chance = (2 - elapsedFrames) * 100;
                        message = `Crouch sooner by ${lateBy.toFixed(
                            1
                        )} frames (${(differenceSeconds * -1).toFixed(1)}s)`;
                    } else {
                        message = `Crouched too late by ${lateBy.toFixed(
                            1
                        )} frames (${(differenceSeconds * -1).toFixed(5)}s)`;
                        chance = 0;
                        crouchTooLateCount += 1;
                    }

                    history = [
                        ...history,
                        {
                            line: message,
                            color: "light",
                            finished: false,
                        },
                        {
                            line: `${elapsedFrames.toFixed(
                                1
                            )} frames have passed`,
                            color: "light",
                            finished: false,
                        },
                    ];

                    if (chance > 0) {
                        potentialSuperglides = [
                            ...potentialSuperglides,
                            chance,
                        ];
                        superglideText = `${chance.toFixed(
                            2
                        )}% chance to hit the superglide`;
                        if (chance > 50) {
                            superglideTextColor = "success";
                        } else if (chance > 25) {
                            superglideTextColor = "warning";
                        } else {
                            superglideTextColor = "danger";
                        }
                    } else {
                        superglideText = `0% chance to hit the superglide`;
                        superglideTextColor = "danger";
                    }

                    history = [
                        ...history,
                        {
                            line: superglideText,
                            color: superglideTextColor,
                            finished: true,
                        },
                    ];

                    attempts = [...attempts, chance];
                    state = states.Ready;
                } else if (state === states.Crouch) {
                    instructions = "Double Crouch Input, resetting";
                    instructionColor = "danger";
                    chance = 0;
                    state = states.Ready;
                }
            } else if (key === $settings.jump.bind) {
                if (state === states.Ready) {
                    startTime = new Date();
                    state = states.Jump;
                } else if (state === states.Jump) {
                    state = states.JumpWarned;
                    instructions =
                        "Multiple jumps detected, results may not reflect ingame behavior.";
                    instructionColor = "warning";
                    superglideText = "";
                } else if (state === states.JumpWarned) {
                    state = states.JumpWarned;
                } else if (state === states.Crouch) {
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
                    const delta =
                        (now.getTime() - startTime) / 1000 + frameTime;
                    const earlyBy = delta / frameTime;

                    chance = 0;

                    superglideText = "0% chance to hit the superglide";
                    superglideTextColor = "danger";
                    message = `Crouch later by ${earlyBy.toFixed(
                        2
                    )} frames (${delta.toFixed(5)}s)`;
                    history = [
                        ...history,
                        {
                            line: message,
                            color: "light",
                            finished: false,
                        },
                        {
                            line: superglideText,
                            color: "danger",
                            finished: true,
                        },
                    ];
                    wrongInputCount += 1;
                    attempts = [...attempts, chance];
                    state = states.Ready;
                }
            } else {
                instructions = `Other key pressed, ignoring`;
                instructionColor = "warning";
            }
        }
    }
</script>

<svelte:head>
    <title>Apex Legends Superglide Trainer</title>
    <meta property="og:title" content="Apex Legends Superglide Trainer" />
    <meta
        property="og:description"
        content="Train your superglide timings here!"
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

<section class="section">
    <h1 class="title is-1 has-text-centered">
        Apex Legends Superglide Trainer
    </h1>
    <div class="box has-text-centered">
        <blockquote>
            <p>
                A Superglide needs a jump input first and then a crouch input 1
                frame later. You need to do the whole Superglide in the last
                0.1-0.2 second of a mantle.
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
                                        Jump:&nbsp;<span class="tag">
                                            {@html prettyBind("jump")}</span
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
                                            >{@html prettyBind("crouch")}</span
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
                            Press any key or mouse button to bind
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
                            <div class="notification is-{superglideTextColor}">
                                {#if superglideText}
                                    <p class="has-text-weight-bold is-size-5">
                                        {superglideText}
                                    </p>
                                {/if}
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
                            <p class="has-text-weight-bold is-size-5">
                                Overall superglide consistency: <code
                                    >{superglideConsistency.toFixed(2)}%</code
                                >
                            </p>
                            <div class="divider" />
                            <p>Attempts: <code> {attempts.length}</code></p>
                            <p>
                                Potential superglides: <code
                                    >{potentialSuperglidesPercentage.toFixed(
                                        2
                                    )}%</code
                                >
                            </p>
                            <p>
                                Average successful chance: <code
                                    >{potentialAvg.toFixed(2)}%</code
                                >
                            </p>
                            <br />
                            <!-- <p>You got <code>0%</code> because:</p> -->
                            <p>
                                Wrong input first: <code
                                    >{wrongInputPercentage.toFixed(2)}%</code
                                >
                            </p>
                            <p>
                                Crouch too late: <code
                                    >{crouchTooLatePercentage.toFixed(2)}%</code
                                >
                            </p>
                            <!-- <br />
                            <p>
                                On a potential superglide your crouch is too
                                late by
                                <code>0.0134</code> ms or <code>0.4</code> FPS on
                                average
                            </p> -->
                            <div class="divider" />
                            <div class="notification">
                                More stats coming soon
                            </div>
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
