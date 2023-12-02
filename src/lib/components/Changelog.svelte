<script>
  import { changelogModalActive } from "$lib/stores";
  import { toggleChgangelogModal } from "$lib/util";
  import { changelog } from "../changelog.json";
</script>

<div class:is-active={$changelogModalActive} class="modal">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-background" on:click={toggleChgangelogModal} />
  <div class="modal-content">
    <div class="box">
      <p class="title has-text-centered">Changelog</p>
      <div class="content">
        <table class="table is-narrow">
          <tbody>
            {#each changelog as log}
              <tr>
                <th>
                  <div class="icon-text is-flex-wrap-nowrap">
                    <span class="icon has-text-info">
                      <i class="far fa-calendar-alt" />
                    </span>
                    <span>{log.date}</span>
                  </div>
                </th>
                <td>{log.note}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <footer>
        <button class="button" on:click={toggleChgangelogModal}>Close</button>
      </footer>
    </div>
  </div>
</div>
