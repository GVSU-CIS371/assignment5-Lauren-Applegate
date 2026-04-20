<template>
  <div>
    <Beverage 
    :isIced="beverageStore.currentTemp === 'Cold'"
    :selectedSyrup="beverageStore.currentSyrup?.id ?? ''"
    :selectedBase="beverageStore.currentBase?.id ?? ''"
    :selectedCreamer="beverageStore.currentCreamer?.id ?? ''" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <div>
      <div v-if="beverageStore.user">
        <p>Signed in as: {{ beverageStore.user.displayName ?? beverageStore.user.email }}</p>
        <button @click="signOut">Sign Out</button>
      </div>
      <div v-else>
        <button @click="withGoogle">Sign in with Google</button>
      </div>
      <p v-if="authMessage">{{ authMessage }}</p>
    </div>

    <input type="text" v-model="beverageStore.currentName" placeholder="Beverage Name" />
    <button @click="makeBeverage" :disabled="!beverageStore.user">🍺 Make Beverage</button>
    <p v-if="!beverageStore.user">Please sign in to save your beverage.</p>
    <p v-if="beverageMessage">{{ beverageMessage }}</p>

    <div v-if="beverageStore.user" id="beverage-container" style="margin-top: 20px">
    <template v-for="beverage in beverageStore.beverages" :key="beverage.id">
      <label>
        <input
          type="radio"
          name="recipe"
          :value="beverage"
          v-model="beverageStore.currentBeverage"
          @change="beverageStore.showBeverage(beverage)"
        />
        {{ beverage.name }}
      </label>
    </template>
  </div>
  </div>

  
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, onMounted, Ref } from "vue";

const beverageStore = useBeverageStore();
const authMessage = ref("");
const beverageMessage = ref("");

// monitor auth state and update store
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});

const showMessage = (msgRef: Ref<string>, message: string) => {
  msgRef.value = message;
  setTimeout(() => {
    msgRef.value = "";
  }, 3000);
};

const withGoogle =  async() => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider)
    .then(() => {
      authMessage.value = "";
    })
    .catch((error) => {
      showMessage(authMessage, `Sign in failed: ${error.message}`);
    });
};

const signOut = () => {
  firebaseSignOut(auth).catch((error) => {
    showMessage(authMessage, `Sign out failed: ${error.message}`);
  });
};

const makeBeverage = () => {
  const message = beverageStore.makeBeverage();
  showMessage(beverageMessage, message ?? "");
};
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
</style>
