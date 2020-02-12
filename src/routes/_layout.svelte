<style>
  :global(*) {
    box-sizing: border-box;
  }

  .logo {
    height: 2rem;
  }
</style>

<main>
  <nav class="uk-navbar-container uk-margin" uk-navbar>
    <div class="uk-navbar-left">
      <a class="uk-navbar-item uk-logo" href="/">
        <img
          class="logo"
          alt="Marvel logo"
          src="https://static-mh.content.disney.io/marvelhq/assets/marvel/marvel-4f0d60111c07.svg" />
        &nbsp;Heroes
      </a>
    </div>
  </nav>
  <div class="uk-container">
    <slot />
  </div>
</main>
