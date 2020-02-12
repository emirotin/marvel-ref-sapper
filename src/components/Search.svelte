<script>
  import { onMount } from "svelte";
  import debounce from "lodash/debounce";

  import marvel from "../lib/marvel";

  import Character from "./Character";

  let search = "";
  let lastSearch = "";
  let isFetching = false;
  let error = null;
  let data = [];
  let page = 1;
  let hasMore = false;

  let searchPromise = null;

  const fetchData = () => {
    isFetching = true;
    error = null;
    hasMore = false;

    if (searchPromise) {
      searchPromise.abort();
    }

    searchPromise = marvel.characters.get({
      nameStartsWith: search,
      page
    });

    searchPromise
      .then(newData => {
        error = null;
        if (!newData) {
          return;
        }
        data = [...data, ...newData.data.results];
        hasMore = newData.data.offset + newData.data.count < newData.data.total;
      })
      .catch(_error => {
        error = _error;
      })
      .finally(() => {
        isFetching = false;
        searchPromise = null;
      });
  };

  const onSearchChange = debounce(() => {
    if (search === lastSearch) {
      return;
    }

    lastSearch = search;
    page = 1;
    data = [];
    fetchData();
  });

  const loadMore = () => {
    page += 1;
    fetchData();
  };

  onMount(fetchData);
</script>

<style>
  .form {
    width: 100%;
  }
</style>

<form class="uk-search uk-search-large form">
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

{#if hasMore}
  <button
    class="uk-button uk-button-primary uk-button-large uk-width-1-1"
    type="button"
    on:click={loadMore}>
    Load more...
  </button>
{/if}

{#if isFetching}
  <div>Loading...</div>
{/if}
