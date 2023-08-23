<template>
  <div class="flare" ref="flareRef"></div>
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

const currentInstance = getCurrentInstance() as ComponentInternalInstance;
const global = currentInstance.appContext.config.globalProperties;

const flareRef = ref();

const state = reactive({});

const flare = () => {
  var renderer;
  function initRender() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //告诉渲染器需要阴影效果
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
    renderer.setClearColor(0x111111);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);
  }

  var camera;
  function initCamera() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 40, 0);
  }

  var scene;
  function initScene() {
    scene = new THREE.Scene();
  }

  var ambientLight, pointLight;
  function initLight() {
    ambientLight = new THREE.AmbientLight("#111111");
    scene.add(ambientLight);

    pointLight = new THREE.PointLight("#ffffff");
    pointLight.position.set(-400, 600, -100);

    //告诉平行光需要开启阴影投射
    pointLight.castShadow = true;

    scene.add(pointLight);

    // 添加 lens flares
    var textureLoader = new THREE.TextureLoader();

    var textureFlare0 = textureLoader.load(
      "examples/textures/lensflare/lensflare0.png"
    );
    var textureFlare2 = textureLoader.load(
      "examples/textures/lensflare/lensflare2.png"
    );
    var textureFlare3 = textureLoader.load(
      "examples/textures/lensflare/lensflare3.png"
    );

    var flareColor = new THREE.Color(0xffffff);
    flareColor.setHSL(0.55, 0.9, 1.0);

    var lensFlare = new THREE.LensFlare(
      textureFlare0,
      500,
      0.0,
      THREE.AdditiveBlending,
      flareColor
    );

    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
    lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

    lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

    lensFlare.position.copy(pointLight.position);

    scene.add(lensFlare);
  }

  var cube, plane;
  function initModel() {
    //辅助工具
    var helper = new THREE.AxisHelper(10);
    scene.add(helper);

    //球体
    var sphereGeometry = new THREE.SphereGeometry(10, 30, 30);
    var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-20, 20, 0);

    sphere.castShadow = true;

    scene.add(sphere);

    //立方体
    var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = 30;
    cube.position.y = 5;
    cube.position.z = -5;

    //告诉立方体需要投射阴影
    cube.castShadow = true;

    scene.add(cube);

    //底部平面
    var planeGeometry = new THREE.PlaneGeometry(5000, 5000, 20, 20);
    var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -0;

    //告诉底部平面需要接收阴影
    plane.receiveShadow = true;

    scene.add(plane);
  }

  //初始化性能插件
  var stats;
  function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
  var controls, clock;
  function initControls() {
    clock = new THREE.Clock();

    controls = new THREE.FlyControls(camera);

    controls.movementSpeed = 100; //设置移动的速度
    controls.rollSpeed = Math.PI / 6; //设置旋转速度
    controls.autoForward = false;
    controls.dragToLook = false;
  }

  //初始化dat.GUI简化试验流程
  var param;
  function initGui() {}

  function render() {
    renderer.render(scene, camera);

    var delta = clock.getDelta();

    //更新性能插件
    stats.update();

    controls.update(delta);
  }

  //窗口变动触发的函数
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    //更新控制器
    render();

    requestAnimationFrame(animate);
  }

  function draw() {
    initRender();
    initScene();
    initCamera();
    initLight();
    initModel();
    initControls();
    initStats();
    initGui();

    animate();
    window.onresize = onWindowResize;
  }
  draw()
};

onMounted(async () => {
  flare();
});
</script>

<style scoped lang="scss">
.flare {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 33;
}
</style>
