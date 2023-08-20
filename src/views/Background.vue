<template>
  <div class="background"></div>
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

const currentRoute = computed(() => {
  return global.$route;
}) as any;

onMounted(async () => {});
</script>

<style scoped lang="scss">
body {
  text-align: center;
}

span {
  line-height: 100vh;
  font-size: 50px;
  color: white;
}
.background {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

.background {
  background-color: #0c0003;
  background-image: radial-gradient(
      closest-side,
      rgb(29, 1, 93),
      rgba(235, 105, 78, 0)
    ),
    radial-gradient(closest-side, rgb(7, 92, 75), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgb(0, 60, 36), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(158, 7, 234), rgba(170, 142, 245, 0));
  background-size: 130vw 130vh, 120vw 120vh, 100vw 150vh, 120vw 130vh;
  background-position: -80vw -80vh, 30vw -20vh, -20vw 20vh, 30vw 20vh;
  background-repeat: no-repeat;
  animation: 15s moiveAnimation infinite;
}

@keyframes moiveAnimation {
  0%,
  100% {
    background-size: 130vw 130vh, 120vw 120vh, 100vw 150vh, 120vw 130vh;
    background-position: -80vw -80vh, 30vw -20vh, -20vw 20vh, 30vw 20vh;
  }
  25% {
    background-size: 120vw 120vh, 130vw 150vh, 130vw 120vh, 100vw 110vh;
    background-position: -30vw -30vh, 40vw -10vh, 0vw 10vh, -10vw 20vh;
  }
  50% {
    background-size: 130vw 130vh, 140vw 100vh, 100vw 150vh, 90vw 110vh;
    background-position: 10vw -60vh, 20vw 10vh, 10vw 30vh, 10vw -20vh;
  }
  75% {
    background-size: 140vw 140vh, 100vw 130vh, 100vw 150vh, 130vw 110vh;
    background-position: -70vw -70vh, 0vw -10vh, 30vw -20vh, 20vw 30vh;
  }
}
</style>
