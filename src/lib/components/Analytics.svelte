<script>
    import { onMount, afterUpdate } from "svelte";

    import {
        settings,
        loopDelayAvg,
        isController,
        history,
        trainingActive,
        sharingModalActive,
        attempts,
        potentialSuperglides,
        wrongInputCount,
        crouchTooLateCount,
        gradientArray,
        isFaqOpen,
    } from "$lib/stores";

    import { percentageColor, toggleSharingModal } from "$lib/util";

    let historydiv;

    // Stat calculations
    $: potentialSum = $potentialSuperglides.reduce((a, b) => a + b, 0);
    $: potentialSuperglidesPercentage = ($potentialSuperglides.length / $attempts.length) * 100 || 0;

    $: potentialAvg = potentialSum / $potentialSuperglides.length || 0;
    $: superglideConsistency = potentialSum / $attempts.length || 0;
    $: wrongInputPercentage = ($wrongInputCount / $attempts.length) * 100 || 0;
    $: crouchTooLatePercentage = ($crouchTooLateCount / $attempts.length) * 100 || 0;

    $: computedPercentageColor = percentageColor(superglideConsistency);

    // This can be improved 100%
    $: averageErrorPerPoll = ($settings.fps / (1000 / $loopDelayAvg)) * 0.5 * 100;
    onMount(() => {
        // keep the scrollbar at the bottom
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }
    });

    afterUpdate(() => {
        // keep the scrollbar at the bottom
        if (trainingActive) {
            historydiv.scrollTop = historydiv.scrollHeight;
        }
    });

    const scrollToFaq = () => {
      const faqHeader = document.querySelector("#faq");
      if (!faqHeader) return;

      isFaqOpen.set(true);

      const scroll = () => {
        faqHeader.scrollIntoView({ behavior: "smooth" });
      };
      const waitAccordionOpenInMs = 50;
      setTimeout(scroll, waitAccordionOpenInMs);
    };
</script>

<div class="level">
    <h3 class="title is-3 level-item has-text-centered">
        <span class="icon-text is-relative">
            <span class="icon">
                <i class="fas fa-chart-bar" />
            </span>&nbsp;
            <span>Analytics</span>
            <a
              class="has-text-white is-underlined"
              style="font-size: 1rem; position: absolute; bottom: 0.5rem; right: -0.75rem;"
              href="#faq"
              on:click|preventDefault={scrollToFaq}
            >?</a>
        </span>
    </h3>
</div>
<div class="columns">
    <div class="column">
        <p class="has-text-weight-bold is-size-5">
            Overall superglide consistency: <code class="has-text-{computedPercentageColor}">{superglideConsistency.toFixed(2)}%</code>
        </p>
        <div class="divider" />
        <p>
            Attempts: <code class="has-text-white"> {$attempts.length}</code>
        </p>
        <p>
            Potential superglides: <code class="has-text-white">{potentialSuperglidesPercentage.toFixed(2)}%</code>
        </p>
        <p>
            Average successful chance: <code class="has-text-white">{potentialAvg.toFixed(2)}%</code>
        </p>
        <br />
        <!-- <p>You got <code>0%</code> because:</p> -->
        <p>
            Wrong input first: <code>{wrongInputPercentage.toFixed(2)}%</code>
        </p>
        <p>
            Crouch too late: <code>{crouchTooLatePercentage.toFixed(2)}%</code>
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
            <p>READ THE FAQ!!!</p>
            <p>Seriously if you can't hit them,</p>
            <p>
                <strong>READ THE TIPS AND FAQ!!!</strong>
            </p>
            <p>ALL OF IT!</p>
        </div>
        <button class="button is-fullwidth" on:click={toggleSharingModal}>Show all stats</button>
    </div>
    <div class="divider is-vertical" />
    <div class="column history" bind:this={historydiv}>
        {#each $history as { line, color, finished }}
            <p>
                <span class="tag is-{color}">{line}</span>
            </p>
            {#if finished}
                <div class="divider" />
            {/if}
        {/each}
    </div>
</div>

<div class:is-active={$sharingModalActive} class="modal">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-background" on:click={toggleSharingModal} />
    <div class="modal-content">
        <div class="box">
            <p class="title has-text-centered">Statistics</p>
            <div class="columns">
                <div class="column">
                    <p class="has-text-weight-bold is-size-5">
                        Overall superglide consistency: <code class="has-text-{computedPercentageColor}">{superglideConsistency.toFixed(2)}%</code>
                    </p>
                    <p>
                        Attempts: <code class="has-text-white"> {$attempts.length}</code>
                    </p>
                    <p>
                        Potential superglides: <code class="has-text-white">{potentialSuperglidesPercentage.toFixed(2)}%</code>
                    </p>
                    <p>
                        Average successful chance: <code class="has-text-white">{potentialAvg.toFixed(2)}%</code>
                    </p>
                    <br />
                    <p>
                        Wrong input first: <code>{wrongInputPercentage.toFixed(2)}%</code>
                    </p>
                    <p>
                        Crouch too late: <code>{crouchTooLatePercentage.toFixed(2)}%</code>
                    </p>
                    <div class="divider" />
                    {#if $isController}
                        <p>
                            Your browser is limiting our timing precision to <code class="has-text-white">{$loopDelayAvg.toFixed(2)}ms</code>. Your current FPS
                            setting is
                            <code class="has-text-white">{$settings.fps}</code>
                        </p>
                        <p class="has-text-weight-bold is-size-5">
                            Result: the % numbers we show you are wrong by an average of <code class="has-text-white">{averageErrorPerPoll.toFixed(2)}</code>%
                        </p>
                    {/if}
                </div>
                <div class="column history is-one-third">
                    {#each $history as { line, color, finished }}
                        <p>
                            <span class="tag is-{color}">{line}</span>
                        </p>
                        {#if finished}
                            <div class="divider" />
                        {/if}
                    {/each}
                </div>
            </div>
            <div class="box" style="background: linear-gradient(90deg, {$gradientArray.join(',')});" />
            <footer>
                <button class="button" on:click={toggleSharingModal}>Close</button>
            </footer>
        </div>
    </div>
</div>
