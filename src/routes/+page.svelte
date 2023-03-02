<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { superglide } from "$lib/util";

    const settings = writable({
        jump: " ",
        crouch: "CONTROL",
        fps: 144,
    });

    let modal = false;
    let trainingActive = false;
    let instructions = "Press jump to start";
    let evenodd = 0;

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
        window.addEventListener(
            "keydown",
            (event) => {
                handleKeyDown(event, setting);
            },
            { once: true }
        );
    }

    function handleKeyDown(event, setting) {
        event.preventDefault();
        $settings[setting] = event.key;
        modal = false;
    }

    function toggleState() {
        this.blur(); // removes focus to disable activation by spacebar
        trainingActive = !trainingActive;
    }
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
</svelte:head>

<svelte:window
    on:keydown={(event) => {
        if (trainingActive) {
            // superglide(event, evenodd);
            console.log(`Pressed key "${event.key}" (${evenodd})`);
            if (evenodd === 0) {
                if (event.key === $settings.jump) {
                    console.log("jump pressed");
                    instructions = "Press crouch";
                } else if (event.key === $settings.crouch) {
                    console.log("crouch pressed");
                    instructions = "Done";
                } else {
                    instructions = "";
                }
            }
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
                <p class="title">Settings</p>
                <p class="subtitle">
                    Click on the buttons below to re-bind them
                </p>
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
                        <p class="title">Training</p>
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
