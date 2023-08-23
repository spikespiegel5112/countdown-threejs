<template>
  <div class="video_container"></div>
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

const videoRef = ref();

const state = reactive({});

const playVideo = () => {
  var videoEl = document.createElement("video");
  videoEl.setAttribute("id", "video");
  videoEl.loop = false;
  videoEl.preload = "auto";
  videoEl.muted = true;
  videoEl.className = "video";
  // videoEl.autoplay = true;
  videoEl.src = require("@/assets/countdown.mp4");
  videoEl.addEventListener("loadedmetadata", function (e) {
    document.querySelector(".video_container").appendChild(videoEl);
  });

  videoEl.addEventListener("canplaythrough", function (e) {
    videoEl.play();
    videoEl.muted = false;
  });
};

onMounted(async () => {
  playVideo();
});
</script>

<style lang="scss">
.video_container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  overflow: hidden;
  video {
    display: block;
    width: 100%;
  }
}
</style>
