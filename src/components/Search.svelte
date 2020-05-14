<script>
  import { onMount } from "svelte";
  import debounce from "lodash/debounce";

  import marvel from "../lib/marvel";

  import Character from "./Character";

  let search = "";
  let lastSearch = "";
  let isFetching = false;
  let error = null;
  let data = null;
  let page = 1;
  let hasMore = false;

  let searchPromise = null;

  const fetchData = ({ reset = false } = {}) => {
    isFetching = true;
    error = null;
    hasMore = false;

    if (reset) {
      page = 1;
      data = null;
    } else {
      page += 1;
    }

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
        error = null;
        isFetching = false;
        searchPromise = null;
        data = [...(data || []), ...newData.data.results];
        hasMore = newData.data.offset + newData.data.count < newData.data.total;
      })
      .catch(_error => {
        error = _error;
      });
  };

  const onSearchChange = debounce(() => {
    if (search === lastSearch) {
      return;
    }
    lastSearch = search;
    fetchData({ reset: true });
  }, 50);

  const loadMore = () => {
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
  <div uk-alert class="uk-alert uk-alert-danger">
    <p>{error.message}</p>
  </div>
{/if}

{#if data && data.length}
  <ul class="uk-list uk-list-divider">
    {#each data as c}
      <Character data={c} />
    {/each}
  </ul>
{/if}

{#if !isFetching && data && data.length === 0}
  <div uk-alert class="uk-alert uk-alert-warning">
    <p>Nothing found</p>
  </div>
{/if}

{#if isFetching}
  <div>Loading...</div>
{/if}

{#if hasMore}
  <button
    class="uk-button uk-button-primary uk-button-large uk-width-1-1"
    type="button"
    on:click={loadMore}>
    Load more...
  </button>
{/if}
