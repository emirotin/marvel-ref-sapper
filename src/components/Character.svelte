<script>
  import marvel from "../lib/marvel";

  export let data;
</script>

<li class="uk-card uk-card-default">
  <a href={`/hero/${data.id}`}>
    <div class="uk-card-header">
      <div class="uk-grid uk-flex-middle" uk-grid>
        <div class="uk-width-auto">
          <img
            alt={data.name}
            class="uk-border-circle"
            width="40"
            height="40"
            src={marvel.getImage(data.thumbnail)} />
        </div>
        <div class="uk-width-expand">
          <h3 class="uk-card-title uk-margin-remove-bottom">{data.name}</h3>
        </div>
      </div>
    </div>
  </a>
</li>
