<script lang="ts">
  export let name = "John";
  export let age: number;

  function notify() {
    console.log("Notified");
  }
</script>

<main>
  <button on:tap={notify} class="button" text="Click me!" />
</main>

<style>
  main {
    padding: 20px;
  }
  .button {
    background: #eee;
  }
</style>
