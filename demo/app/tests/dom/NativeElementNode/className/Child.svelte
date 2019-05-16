<svelte:options accessors={true}/>

<script>
import Parent from './Parent.svelte'
export let test_subject
</script>

<Parent>
  <label
    bind:this={test_subject}
    class="constClass"
    class:trueClass={true}
    class:falseClass={false}
  />
</Parent>
