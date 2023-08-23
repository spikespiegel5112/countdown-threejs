<template>
  <div class="countdown" ref="countdownRef"></div>
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
  emit,
  defineEmits,
  nextTick,
} from "vue";

import * as THREE from "three";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const countdownRef = ref(null);

const emit = defineEmits<{
  (e: "onFinshed", data: any): void;
}>();

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

const state = reactive({
  finishFlag: false,
  cheat: "",
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const currentRoute = computed(() => {
  return global.$route;
}) as any;

let container;
let camera, cameraTarget, scene, renderer;
let dirLight1;
let group, textMesh1, textMesh2, textMesh3, textMesh4, material;
let firstLetter = true;
const mirror = true;
let text1 = "距离护网结束还有";
let text2 = "00:00:00";
let text3 = "海通恒信护网行动工作";
let text4 = "圆满完成";
const deadlineStr = "2023-08-23 20:59:30";
// const deadlineStr = "2023-08-23 14:17:00";

let font = null;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

const width = 20,
  height = 20,
  size = 35,
  size2 = 80,
  hover = 100,
  hover2 = -30,
  curveSegments = 4,
  bevelThickness = 5,
  bevelSize = 1.5;
const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

const initThree = () => {
  init();
  animate();

  function init() {
    container = document.createElement("div");

    countdownRef.value.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1500);
    camera.position.set(0, 100, 1500);

    cameraTarget = new THREE.Vector3(0, 0, 0);

    // SCENE

    scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x000000, 20, 5000);

    // LIGHTS

    dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight1.position.set(0, 0, 1).normalize();
    // scene.add(dirLight1);

    // const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    // dirLight2.position.set(0, hover, 10).normalize();
    // dirLight2.color.setHSL(0.3, 1, 1, THREE.SRGBColorSpace);
    // scene.add(dirLight2);

    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      specular: "white",
      shininess: 300,
    });

    group = new THREE.Group();
    group.position.y = 0;

    scene.add(group);

    const loader = new TTFLoader();
    const fontJson = require("@/assets/HanYiXiJianHeiJian-1.json");
    font = new Font(fontJson);
    createText1();

    // loader.load(require("@/assets/HanYiXiJianHeiJian-1.ttf"), function (json) {
    //   console.log("loader.load+++", JSON.stringify(json));
    //   font = new Font(json);
    //   createText1();
    // });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.2,
        transparent: true,
      })
    );
    plane.position.y = 100;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

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
      text1 = "";
    }

    const keyCode = event.keyCode;

    // backspace

    if (keyCode === 8) {
      event.preventDefault();

      text1 = text1.substring(0, text1.length - 1);
      // refreshText2();

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
      text1 += ch;

      refreshText2();
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

const refreshText1 = () => {
  group.remove(textMesh1);
  if (state.finishFlag) return;
  createText1();
};

const refreshText2 = () => {
  group.remove(textMesh2);
  if (state.finishFlag) return;
  createText2();
};

const createText1 = () => {
  const textGeo1 = new TextGeometry(text1, {
    font: font,

    size: size,
    height: height,
    curveSegments: curveSegments,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: true,
  });

  textGeo1.computeBoundingBox();
  textGeo1.computeVertexNormals();

  const centerOffset =
    -0.5 * (textGeo1.boundingBox.max.x - textGeo1.boundingBox.min.x);

  textMesh1 = new THREE.Mesh(textGeo1, material);

  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;

  group.add(textMesh1);
};

const createText2 = () => {
  const textGeo2 = new TextGeometry(text2, {
    font: font,

    size: size2,
    height: height,
    curveSegments: curveSegments,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: true,
  });
  textGeo2.computeBoundingBox();
  textGeo2.computeVertexNormals();
  const centerOffset =
    -0.5 * (textGeo2.boundingBox.max.x - textGeo2.boundingBox.min.x);
  textMesh2 = new THREE.Mesh(textGeo2, material);

  textMesh2.position.x = centerOffset;
  textMesh2.position.y = hover2;
  textMesh2.position.z = height;

  textMesh2.rotation.x = 0;
  textMesh2.rotation.y = Math.PI * 2;

  group.add(textMesh2);
};

const createText3 = () => {
  const textGeo3 = new TextGeometry(text3, {
    font: font,

    size: size2,
    height: height,
    curveSegments: curveSegments,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: true,
  });
  textGeo3.computeBoundingBox();
  textGeo3.computeVertexNormals();
  const centerOffset =
    -0.5 * (textGeo3.boundingBox.max.x - textGeo3.boundingBox.min.x);
  textMesh3 = new THREE.Mesh(textGeo3, material);

  textMesh3.position.x = centerOffset;
  textMesh3.position.y = hover2 + 80;
  textMesh3.position.z = height;

  textMesh3.rotation.x = 0;
  textMesh3.rotation.y = Math.PI * 2;

  group.add(textMesh3);
};

const createText4 = () => {
  const textGeo4 = new TextGeometry(text4, {
    font: font,

    size: size2,
    height: height,
    curveSegments: curveSegments,

    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: true,
  });
  textGeo4.computeBoundingBox();
  textGeo4.computeVertexNormals();
  const centerOffset =
    -0.5 * (textGeo4.boundingBox.max.x - textGeo4.boundingBox.min.x);
  textMesh4 = new THREE.Mesh(textGeo4, material);

  textMesh4.position.x = centerOffset;
  textMesh4.position.y = hover2 - 60;
  textMesh4.position.z = height;

  textMesh4.rotation.x = 0;
  textMesh4.rotation.y = Math.PI * 2;

  group.add(textMesh4);
};

const addZero: any = (num: string | number, length = 2) => {
  if ((num + "").length >= length) {
    return num;
  }
  return addZero("0" + num, length);
};

const countDown = () => {
  const deadlineTimeStamp = global.$moment(deadlineStr);
  const loop = () => {
    setTimeout(() => {
      const currentTime = global.$moment(); //当前时间
      text2 = "";
      const duratioTimeStamp = global
        .$moment(deadlineTimeStamp)
        .diff(global.$moment(currentTime), "milliseconds");
      const days = global.$moment.duration(duratioTimeStamp).days();
      state.hours =
        global.$moment.duration(duratioTimeStamp).hours() + days * 24;
      state.minutes = global.$moment.duration(duratioTimeStamp).minutes();
      state.seconds = global.$moment.duration(duratioTimeStamp).seconds();

      if (state.hours > 0) {
        text2 += `${state.hours}小时 `;
      }
      if (state.hours > 0 || (state.hours === 0 && state.minutes > 0)) {
        text2 += `${addZero(state.minutes)}分 `;
      }
      text2 += `${addZero(state.seconds)}秒`;

      refreshText2();

      if (
        (state.hours <= 0 && state.minutes <= 0 && state.seconds <= 30) ||
        state.finishFlag
      ) {
        state.finishFlag = true;
        emit("onFinshed", state.finishFlag);

        group.remove(textMesh1);
        group.remove(textMesh2);
        createText3();
        createText4();
      } else {
        loop();
      }
    }, 1000);
  };
  loop();
};

const cheat = () => {
  let cheatArr = [];
  let gesture = "";
  let gestureArr = [];

  document.addEventListener("keyup", (event: any) => {
    console.log(event);
    if (event.code === "Digit0" || event.code === "Numpad0") {
      state.cheat += event.key;
    }
    cheatArr = state.cheat.split("");
    if (cheatArr.filter((item: string) => item === "0").length >= 5) {
      state.finishFlag = true;
    }

    if (event.code === "Digit1" || event.code === "Numpad1") {
      gesture += event.key;
    }
    gestureArr = gesture.split("");
    if (gestureArr.filter((item: string) => item === "1").length >= 3) {
      scene.add(dirLight1);
    }
  });
};

onMounted(async () => {
  initThree();
  countDown();
  cheat();
});
</script>

<style lang="scss">
.countdown {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 3;
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
