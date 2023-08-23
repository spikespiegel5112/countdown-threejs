<template>
  <div class="video_container">
    <img v-if="state.ended" src="@/assets/1692771094104.jpg" alt="" />
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

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

interface Props {
  play?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  play: false,
});

const videoRef = ref();

const state = reactive({
  ended: false,
});

watch(
  () => props.play,
  async (newValue: any) => {
    if (!!newValue) {
      await nextTick();
      playVideo();
    }
  }
);

const videoEl = document.createElement("video");

const playVideo = () => {
  if (!!state.ended) return;
  videoEl
    .play()
    .then((response: any) => {})
    .catch((error) => {
      videoEl.muted = true;
      videoEl.play();
    });
};

const init = () => {
  videoEl.setAttribute("id", "video");
  videoEl.loop = false;
  videoEl.preload = "auto";
  videoEl.muted = true;
  videoEl.className = "video";
  // videoEl.autoplay = true;
  videoEl.src =
    process.env.NODE_ENV === "production"
      ? "./countdown.mp4"
      : "/countdown.mp4";
  videoEl.addEventListener("canplaythrough", function (e) {
    videoEl.muted = false;
  });

  videoEl.addEventListener("ended", function (e) {
    state.ended = true;
  });
  videoEl.addEventListener("loadedmetadata", function (e) {
    document.querySelector(".video_container").appendChild(videoEl);
  });
};

const handleFinished = () => {
  const currentTimeStamp = global.$moment().valueOf();
  const finishedTimeStamp = global.$moment("2023-08-23T21:03:00").valueOf();
  if (currentTimeStamp > finishedTimeStamp) {
    state.ended = true;
  }
};

onMounted(async () => {
  console.log(
    "handleFinished+++",
    global.$moment().format("yyyy-MM-DD HH:mm:ss")
  );

  handleFinished();

  init();
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
    background-color: #000;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2222;
  }
}
</style>
