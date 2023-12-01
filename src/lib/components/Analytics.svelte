<script>
  import { onMount, afterUpdate } from "svelte";
  import Chart from "chart.js/auto";

  import {
    settings,
    loopDelayAvg,
    isController,
    history,
    chartHistory,
    trainingActive,
    sharingModalActive,
    attempts,
    potentialSuperglides,
    wrongInputCount,
    crouchTooLateCount,
    gradientArray,
    analyticsHidden,
  } from "$lib/stores";

  import { percentageColor, toggleSharingModal, toggleAnalytics } from "$lib/util";

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

  let ctx;
  let chart;

  $: if (chart) {
    const storeValues = $chartHistory;
    chart.data.datasets[0].data = storeValues;
    chart.data.labels = storeValues.map((_, index) => `Attempt #${index + 1}`); // Use array indices as labels
    chart.update();
  }
  onMount(() => {
    // keep the scrollbar at the bottom
    if (trainingActive) {
      historydiv.scrollTop = historydiv.scrollHeight;
    }

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            data: chartHistory,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              // IDK, thats stolen straight from the docs
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += `${context.parsed.y.toFixed(2)} %`;
                }
                return label;
              },
            },
          },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "% Chance",
            },
          },
          x: {
            title: {
              display: true,
              text: "Number of tries",
            },
          },
        },
      },
    });
  });

  afterUpdate(() => {
    // keep the scrollbar at the bottom
    if (trainingActive) {
      historydiv.scrollTop = historydiv.scrollHeight;
    }
  });
</script>

<div class="card">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <a class="card-header" on:click={() => toggleAnalytics(!$analyticsHidden)}>
    <button class="button card-header-icon is-large" aria-label="collapse helpful tips">
      <i class="fa fa-angle-{$analyticsHidden ? 'down' : 'up'}" />
    </button>
    <p class="card-header-title title is-3 is-centered">
      <span class="icon-text"><span class="icon"><i class="fas fa-chart-bar" /></span>&nbsp;<span>Analytics</span></span>
    </p>
  </a>
  <div class="card-content {$analyticsHidden ? 'is-hidden' : ''}">
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
      <!-- svelte-ignore a11y-no-static-element-interactions -->
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
            <div class="column history">
              {#each $history as { line, color, finished }}
                <p>
                  <span class="tag is-{color}">{line}</span>
                </p>
                {#if finished}
                  <div class="divider" />
                {/if}
              {/each}
            </div>
            <div class="column is-half"><canvas bind:this={ctx} id="myChart" /></div>
          </div>
          <div class="box" style="background: linear-gradient(90deg, {$gradientArray.join(',')});" />
          <footer>
            <button class="button" on:click={toggleSharingModal}>Close</button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</div>
