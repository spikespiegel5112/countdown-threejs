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

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

const state = reactive({});

onMounted(() => {
  setTimeout(() => {
    global.$router.push({
      name: "Layout",
    });
  }, 1000);
});
</script>

<style scoped lang="scss">
#app{
  background: #000;
}
</style>
