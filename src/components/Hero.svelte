<script>
  import { onMount } from "svelte";

  import marvel from "../lib/marvel";
  import getRelatedCharacters from "../lib/related";

  export let id;

  let isFetching = false;
  let error = null;
  let data = null;
  let relatedCharacters = null;
  let isClient = false;

  onMount(() => {
    isClient = true;
  });

  const fetchDetails = id => {
    if (!id) {
      return;
    }

    isFetching = true;
    error = null;
    data = null;
    relatedCharacters = null;

    // fetch related characters independently
    getRelatedCharacters(id).then(_data => {
      relatedCharacters = _data;
    });

    marvel
      .characters(id)
      .get()
      .then(_data => {
        data = _data.data.results[0];
        error = null;
      })
      .catch(_error => {
        error = _error;
      })
      .finally(() => {
        isFetching = false;
      });
  };

  $: {
    isClient && fetchDetails(id);
  }
</script>

<style>
  @media (max-width: 640px) {
    .card {
      flex-direction: column;
    }
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
  }

  .pill {
    height: calc(2rem + 10px);
    margin: 0.1rem;
  }

  .imageSmall {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }

  .relatedContainer {
    margin: -0.1rem;
  }
</style>

<svelte:head>
  <title>Marvel Heroes {data ? data.name : ''}</title>
</svelte:head>

{#if error}
  <div uk-alert class="uk-alert uk-alert-danger">
    <p>{error.message}</p>
  </div>
{/if}

{#if data}
  <div class="uk-card uk-card-default uk-flex card">
    <div class="uk-card-media-top uk-width-1-3@m uk-width-1-1">
      <img
        src={marvel.getImage(data.thumbnail)}
        alt={data.name}
        class="image" />
    </div>
    <div class="uk-card-body uk-width-2-3@m uk-width-1-1">
      <h1>{data.name}</h1>

      <p>{data.description}</p>

      <h3>Related characters</h3>
      {#if relatedCharacters}
        <div class="uk-flex uk-flex-wrap relatedContainer">
          {#each relatedCharacters as c}
            <a href={`/hero/${c.id}`} class="uk-badge pill">
              <img
                src={marvel.getImage(c.thumbnail)}
                alt={c.name}
                class="imageSmall" />
              &nbsp;{c.name}
            </a>
          {/each}
        </div>
      {:else}Loading...{/if}
    </div>
  </div>
{/if}

{#if isFetching}
  <div>Loading...</div>
{/if}
