<script>
  import { toggleChgangelogModal } from "$lib/util";
</script>

<footer class="footer">
  <div class="content has-text-centered">
    <p>
      This website is made by <a href="https://github.com/muckelba">@muckelba</a>
      with the help of <a href="https://github.com/Pvn31">@Pvn31</a>
      and is based on this
      <a href="https://github.com/AngryGroceries/Apex_Superglide_Practice_Tool">powershell script</a>.
    </p>
    <p>
      Contributors: <a href="https://www.youtube.com/@Mokeysniper">@Mokeysniper</a>,
      <a href="https://github.com/AngryGroceries">@AngryGroceries </a>and
      <a href="https://github.com/JayTheYggdrasil">@JayTheYggdrasil</a>
      .
    </p>
    <p>
      <span class="icon"> <i class="fas fa-scroll" /></span>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={toggleChgangelogModal}> Changelog </a>
      <span class="icon"> <i class="fab fa-github" /></span>
      <a href="https://github.com/muckelba/superglidetrainer"> Sourcecode </a>
      <span class="icon"> <i class="fab fa-reddit" /></span>
      <a href="https://reddit.com/r/apexrollouts">Subreddit</a>
      <span class="icon"> <i class="fab fa-discord" /></span>
      <a href="https://discord.gg/7RshRDZ">Discordserver</a>
    </p>
  </div>
</footer>
