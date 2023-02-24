<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    const settings = writable({
        jump: "",
        crouch: "",
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
        $settings[setting] = event.key;
        modal = false;
    }
</script>

<h1>Superglide Trainer</h1>
<p>
    <button on:click={() => setSetting("jump")}>
        Jump: {$settings.jump || "unbound"}
    </button>
</p>

<p>
    <button on:click={() => setSetting("crouch")}>
        Crouch: {$settings.crouch || "unbound"}
    </button>
</p>

<p>
    FPS: <input bind:value={$settings.fps} type="number" />
</p>

{#if modal}
    <div class="modal">Press a button you want to assign</div>
{/if}

<p>
    Jump + crouch must be exactly 1 frame apart for the highest chance at
    superglide success.
</p>
