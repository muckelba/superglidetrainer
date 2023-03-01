<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    const settings = writable({
        jump: " ",
        crouch: "CONTROL",
        fps: 144,
    });

    let modal = false;

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
        $settings[setting] = event.key.toUpperCase();
        modal = false;
    }
</script>

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
                                    : $settings.jump}</span
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
                                    : $settings.crouch}</span
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
                        <!-- navbar items -->
                        <p class="title">Training</p>
                    </div>

                    <div class="navbar-end">
                        <!-- navbar items -->
                        <p class="control">
                            <button class="button is-success">
                                Start/Stop
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
