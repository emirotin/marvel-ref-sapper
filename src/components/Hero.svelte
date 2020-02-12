<script>
  import { onMount } from "svelte";

  import marvel from "../lib/marvel";

  export let id;

  let isFetching = false;
  let error = null;
  let data = null;

  const fetchDetails = () => {
    if (!id) {
      return;
    }
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

  onMount(fetchDetails);
</script>

<style>
  @media (max-width: 600px) {
    .card {
      flex-direction: column;
    }
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
  }
</style>

<svelte:head>
  <title>Marvel Heroes {data ? data.name : ''}</title>
</svelte:head>

{#if error}
  <div uk-alert className="uk-alert-danger">{data.error.message}</div>
{/if}

{#if data}
  <div class="uk-card uk-card-default uk-flex card">
    <div class="uk-card-media-top">
      <img
        src={marvel.getImage(data.thumbnail)}
        alt={data.name}
        class="image" />
    </div>
    <div class="uk-card-body">
      <h1>{data.name}</h1>

      <p>{data.description}</p>
    </div>
  </div>
{/if}

{#if isFetching}
  <div>Loading...</div>
{/if}
