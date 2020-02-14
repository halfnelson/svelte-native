<script>
  export let item;
</script>

<gridLayout columns="auto,*" class="item-template">
  <image src={item.image} class="far" />
  <stackLayout col="1">
    <label id="labeltest" whiteSpace="normal">
      <span fontSize="20" text="{item.name}{'\n'}" />
      <span fontSize="10" text={item.description} />
    </label>
  </stackLayout>
</gridLayout>
