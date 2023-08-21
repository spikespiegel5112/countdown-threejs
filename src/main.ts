import app from "@/utils/appInstance";

import "normalize.css";

import "@/style/mobile.scss";
import "@/style/common.scss";



// const HWH5 = require("@/assets/js/hwh5_jsapi.js").default;

app.mount("#app");

import "@/utils/permission.ts";

export default app;
