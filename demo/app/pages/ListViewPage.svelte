<script>
  import Header from "../Header.svelte";
  import ListViewTemplateComponent from "./ListViewTemplateComponent.svelte";
  import { onMount } from "svelte";
  import { Template } from "svelte-native/components";
  import { ObservableArray } from "@nativescript/core/data/observable-array";

  let images = [
    "font://\uf567",
    "font://\uf579",
    "font://\uf119",
    "font://\uf57f",
    "font://\uf580",
    "font://\uf581",
    "font://\uf582",
    "font://\uf583",
    "font://\uf584",
    "font://\uf585",
    "font://\uf586",
    "font://\uf587",
    "font://\uf588",
    "font://\uf589",
    "font://\uf58A",
    "font://\uf58B",
    "font://\uf58C"
  ];
  let listView;

  function generateItems(count, offset = 0) {
    return new Array(count).fill().map((_, i) => ({
      index: i,
      name: `Item ${i + offset}`,
      description: `Item ${i + offset} description`,
      image: images[(i + offset) % images.length]
    }));
  }

  let items = new ObservableArray(generateItems(50));

  function onItemTap({ index }) {
    alert(`Item tapped: ${items.getItem(index).name}`);
  }

  function loadMoreItems(args) {
    let listview = args.object;
    if (items.length >= 150) {
      args.returnValue = false;
    } else {
      setTimeout(() => {
        items.push(generateItems(50, items.length));
      }, 1500);
    }
  }

  function selectTemplate(item, index, items) {
    return index % 2 == 0 ? "even" : "odd";
  }
</script>

<style>
  .item-template {
    background-color: white;
  }

  .item-template label {
    padding: 0;
    margin: 0;
  }

  .item-template image {
    margin-left: 10;
    margin-right: 5;
    height: 40;
    width: 40;
  }
</style>

<page>
  <Header title="ListView" />
  {#if items}
    <ListViewTemplateComponent item={items.getItem(0)} />
  {/if}
  <collectionview
    {items}
    bind:this={listView}
    itemTemplateSelector={selectTemplate}
    on:itemTap={onItemTap}>
    <Template key="even" let:item>
      <ListViewTemplateComponent {item} />
    </Template>

    <Template key="odd" let:item>
      <gridLayout columns="*, auto" class="item-template odd">
        <stackLayout>
          <label id="labeltest2" whiteSpace="normal">
            <span fontSize="20" text="{item.name}{'\n'}" />
            <span fontSize="10" text={item.description} />
          </label>
        </stackLayout>
        <image col="1" src={item.image} class="far" />
      </gridLayout>
    </Template>
  </collectionview>
</page>
