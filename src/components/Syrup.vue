<template>
  <div
    class="syrup"
    :style="{ '--texture-color': syrupColor, backgroundColor: syrupColor }"
  ></div>
</template>

<script setup lang="ts">
import { useBeverageStore } from "../stores/beverageStore";
import { computed } from "vue";
const store = useBeverageStore();

const props = defineProps<{
  selectedSyrup: string;
}>();

const syrupColor = computed(() => {
  const option = store.syrups.find((s) => s.id === props.selectedSyrup);
  return option?.color ?? "#c6c6c6";
});
</script>

<style lang="scss" scoped>
.syrup {
  transform: translateY(400%);
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;
  background: repeating-linear-gradient(
    45deg,
    var(--texture-color),
    var(--texture-color) 10px,
    rgba(225, 207, 149, 1) 10px,
    rgba(225, 207, 149, 1) 20px
  );
}
</style>
