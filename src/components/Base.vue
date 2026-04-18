
<template>
  <div class="baseBeverage" :style="{ backgroundColor: baseColor }"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBeverageStore } from "../stores/beverageStore";
const store = useBeverageStore(); 

const props = defineProps<{
  selectedBase: string;
}>();

const baseColor = computed(() => {
  const option = store.bases.find((b) => b.id === props.selectedBase);
  return option?.color ?? "#c6c6c6";
});

</script>

<style scoped>
.baseBeverage {
  position: relative;
  width: 100%;
  height: 100%;
  bottom: 0;
  animation: pour-tea 2s;
  z-index: 300;
  /* // border-radius: 0.05em 0.05em 2.2em 2.2em; */
}
</style>