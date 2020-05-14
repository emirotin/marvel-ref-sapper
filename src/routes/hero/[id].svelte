<script context="module">
  import Hero from "../../components/Hero";

  export const preload = ({ params: { id } }) => ({ id });
</script>

<script>
  export let id;
</script>

<Hero {id} />
