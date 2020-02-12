<script context="module">
  import Hero from "../../components/Hero";

  export function preload({ params }) {
    const { id } = params;
    return { id };
  }
</script>

<script>
  export let id;
</script>

<Hero {id} />
