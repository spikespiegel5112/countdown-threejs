<template>
  <router-view />
</template>

<script lang="tsx" setup>
import {
  ref,
  unref,
  reactive,
  watch,
  computed,
  onMounted,
  getCurrentInstance,
  ComponentInternalInstance,
  nextTick,
} from "vue";
import { getBaiduTokenRequest } from "@/api/auth";

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

const state = reactive({});

onMounted(() => {});
</script>

<style scoped lang="scss">
.countdown_container {
  background: #ccc;
  .header {
    height: 10rem;
    font-size: 0.7rem;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
