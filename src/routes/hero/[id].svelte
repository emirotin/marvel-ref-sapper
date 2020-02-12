<script context="module">
  export function preload({ params }) {
    return { id: params.id };
  }
</script>

<script>
  export let id;
</script>

<h1>Hero {id}</h1>
