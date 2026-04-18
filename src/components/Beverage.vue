<template>
  <Mug>
    <Cold v-if="isIced" />
    <Hot v-else />
    <Contents>
      <template v-slot:top>
        <Creamer v-if="selectedCreamer !== noCreamerId" :selectedCreamer="selectedCreamer" />
      </template>
      <template v-slot:mid>
        <Syrup v-if="selectedSyrup !== noSyrupId" :selectedSyrup="selectedSyrup" />
      </template>
      <template v-slot:bottom>
        <Base :selectedBase="selectedBase" />
      </template>
    </Contents>
  </Mug>
</template>


<script setup lang="ts">
import { computed } from "vue";
import Contents from "./Contents.vue";
import Mug from "./Mug.vue";
import Syrup from "./Syrup.vue";
import Base from "./Base.vue";
import Creamer from "./Creamer.vue";
import Hot from "./Hot.vue";
import Cold from "./Cold.vue";
import { useBeverageStore } from "../stores/beverageStore";
const store = useBeverageStore();


type Props = {
  isIced: boolean;
  selectedSyrup: string;
  selectedCreamer: string;
  selectedBase: string;
};
defineProps<Props>();

const noCreamerId = computed(() => store.creamers.find((c) => c.name === "No Cream")?.id ?? "c1");
const noSyrupId = computed(() => store.syrups.find((s) => s.name === "No Syrup")?.id ?? "s1");
</script>
