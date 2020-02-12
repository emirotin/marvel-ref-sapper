<script>
  import { onMount } from "svelte";
  import debounce from "lodash/debounce";

  import marvel from "../lib/marvel";

  import Character from "./Character";

  let search = "";
  let lastSearch = null;
  let isFetching = false;
  let error = null;
  let data = [];
  let page = 1;

  let searchPromise = null;

  const onSearchChange = debounce(() => {
    if (search === lastSearch) {
      return;
    }

    lastSearch = search;
    isFetching = true;
    data = [];
    error = null;

    if (searchPromise) {
      searchPromise.abort();
    }

    searchPromise = marvel.characters.get({
      nameStartsWith: search,
      page
    });

    searchPromise
      .then(newData => {
        if (!newData) {
          return;
        }
        data = [...data, ...newData.data.results];
        error = null;
      })
      .catch(_error => {
        error = _error;
      })
      .finally(() => {
        isFetching = false;
        searchPromise = null;
      });
  });

  onMount(onSearchChange);
</script>

<form class="uk-search uk-search-large">
  <span uk-search-icon />
  <input
    class="uk-search-input"
    type="search"
    bind:value={search}
    on:keyup={onSearchChange}
    placeholder="Search..." />
</form>

{#if error}
  <div uk-alert className="uk-alert-danger">{error.message}</div>
{/if}

{#if data && data.length}
  <ul class="uk-list uk-list-divider">
    {#each data as c}
      <Character data={c} />
    {/each}
  </ul>
{/if}

{#if isFetching}
  <div>Loading...</div>
{/if}
