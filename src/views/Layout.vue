<template>
  <div class="countdown" ref="countdownRef">
    <!-- <Firework v-if="state.finishFlag" /> -->
    <Video v-if="state.finishFlag" />
    <CountDown v-if="!state.finishFlag" @onFinshed="handleOnFinshed" />
    <Background v-if="!state.finishFlag" />
    <Star v-if="!state.finishFlag" />
  </div>
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

import Video from "./Video.vue";
import Background from "./Background.vue";
import Star from "./Star.vue";
import Flare from "./Flare.vue";
import CountDown from "./CountDown.vue";

const countdownRef = ref(null);

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

const state = reactive({
  finishFlag: false,
});

const handleOnFinshed = () => {
  state.finishFlag = true;
};

onMounted(async () => {});
</script>

<style lang="scss"></style>
