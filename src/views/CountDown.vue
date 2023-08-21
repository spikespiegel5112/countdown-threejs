<template>
  <div class="countdown" ref="countdownRef">
    <Background />
    <Star />
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

import * as THREE from "three";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import Background from "./Background.vue";
import Star from "./Star.vue";

const countdownRef = ref(null);

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

const state = reactive({});

const currentRoute = computed(() => {
  return global.$route;
}) as any;

let container;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textMesh2, textGeo, material;
let firstLetter = true;
const mirror = true;
let text = "three.js";

let font = null;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

const height = 20,
  size = 70,
  hover = 30,
  curveSegments = 4,
  bevelThickness = 2,
  bevelSize = 1.5;

const initThree = () => {
  init();
  animate();

  function init() {
    container = document.createElement("div");
    const appEl = document.getElementById("app");

    countdownRef.value.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      1500
    );
    camera.position.set(0, 400, 700);

    cameraTarget = new THREE.Vector3(0, 150, 0);

    // SCENE

    scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x000000, 250, 1400);

    // LIGHTS

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight1.position.set(0, 0, 1).normalize();
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.position.set(0, hover, 10).normalize();
    dirLight2.color.setHSL(Math.random(), 1, 0.5, THREE.SRGBColorSpace);
    scene.add(dirLight2);

    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    });

    group = new THREE.Group();
    group.position.y = 100;

    scene.add(group);

    const loader = new TTFLoader();

    loader.load(require("@/assets/kenpixel.ttf"), function (json) {
      font = new Font(json);
      createText();
    });

    // const plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(10000, 10000),
    //   new THREE.MeshBasicMaterial({
    //     color: 0xffffff,
    //     opacity: 0.5,
    //     transparent: true,
    //   })
    // );
    // plane.position.y = 100;
    // plane.rotation.x = -Math.PI / 2;
    // scene.add(plane);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setClearAlpha(0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置背景颜色
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // EVENTS

    container.style.touchAction = "none";
    container.addEventListener("pointerdown", onPointerDown);

    document.addEventListener("keypress", onDocumentKeyPress);
    document.addEventListener("keydown", onDocumentKeyDown);

    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentKeyDown(event) {
    if (firstLetter) {
      firstLetter = false;
      text = "";
    }

    const keyCode = event.keyCode;

    // backspace

    if (keyCode === 8) {
      event.preventDefault();

      text = text.substring(0, text.length - 1);
      refreshText();

      return false;
    }
  }

  function onDocumentKeyPress(event) {
    const keyCode = event.which;

    // backspace

    if (keyCode === 8) {
      event.preventDefault();
    } else {
      const ch = String.fromCharCode(keyCode);
      text += ch;

      refreshText();
    }
  }

  function onPointerDown(event) {
    if (event.isPrimary === false) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(event) {
    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;

    targetRotation =
      targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
  }

  function onPointerUp() {
    if (event.isPrimary === false) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  }

  //

  function animate() {
    requestAnimationFrame(animate);

    group.rotation.y += (targetRotation - group.rotation.y) * 0.05;

    camera.lookAt(cameraTarget);

    renderer.render(scene, camera);
  }
};

const refreshText = () => {
  group.remove(textMesh1);
  if (mirror) group.remove(textMesh2);

  if (!text) return;

  createText();
};

const createText = () => {
  textGeo = new TextGeometry(text, {
    font: font,

    size: size,
    height: height,
    curveSegments: curveSegments,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: true,
  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  const centerOffset =
    -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  textMesh1 = new THREE.Mesh(textGeo, material);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  group.add(textMesh1);

  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, material);

    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -hover;
    textMesh2.position.z = height;

    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;

    group.add(textMesh2);
  }
};

const addZero: any = (num: string | number, length = 2) => {
  if ((num + "").length >= length) {
    return num;
  }
  return addZero("0" + num, length);
};

const countDown = () => {
  const dataOffset = 8 * 60 * 60 * 1000;
  const deadlineTimeStamp = global.$moment("2023-08-21 15:00:00");

  const loop = () => {
    setTimeout(() => {
      var x = global.$moment(); //当前时间
      // var duration = global.$moment.duration(deadlineTimeStamp.diff(x));
      // const durationAsMilliseconds = duration.as("milliseconds");

      const duratioTimeStamp = global
        .$moment(deadlineTimeStamp)
        .diff(global.$moment(x), "milliseconds");
      const hours = global.$moment.duration(duratioTimeStamp).hours();
      const minutes = global.$moment.duration(duratioTimeStamp).minutes();
      const seconds = global.$moment.duration(duratioTimeStamp).seconds();

      text = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;

      console.log(duratioTimeStamp);
      console.log(
        global
          .$moment(duratioTimeStamp)
          // .locale("zh-cn")
          .format("yyyy-MM-DD hh:mm:ss")
      );
      console.log(text);
      refreshText();
      loop();
    }, 1000);
  };
  loop();
};

onMounted(async () => {
  initThree();
  countDown();
  nextTick();
});
</script>

<style lang="scss">
.countdown {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
  background-color: transparent;
  canvas {
    background-color: transparent;
  }
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
}

#canvas-number {
  width: 680px;
  height: 420px;
}
</style>
