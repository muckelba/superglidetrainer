<script>
  import {
    siteDomain,
    siteTitle,
    siteDescription,
    imagePath,
    imageAlt,
  } from "$lib/config";
  import { onMount } from "svelte";

  import "../app.scss";

  onMount(() => {
    // Only enable tracking for prod
    if (window.location.origin === siteDomain) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://umami.anton.wtf/script.js";
      script.defer = true;
      script.async = true;
      script.setAttribute(
        "data-website-id",
        "4e7c534d-4079-424b-aef5-cd74274718dc"
      );
      document.head.appendChild(script);
    }
  });
</script>

<svelte:head>
  <title>{siteTitle}</title>
  <!-- OpenGraph -->
  <meta property="og:title" content={siteTitle} />
  <meta property="og:description" content={siteDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="{siteDomain}/{imagePath}" />
  <meta property="og:url" content={siteDomain} />
  <!-- Robots -->
  <meta
    name="robots"
    content="index, follow, max-snippet:-1, max-image-preview:large"
  />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={siteTitle} />
  <meta name="twitter:description" content={siteDescription} />
  <meta name="twitter:image" content="{siteDomain}/{imagePath}" />
  <meta name="twitter:image:alt" content={imageAlt} />
  <!-- Google -->
  <meta name="description" content={siteDescription} />
  <!-- Font Awesome -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>
<slot />
