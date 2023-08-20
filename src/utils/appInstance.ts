import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import utils from "@/utils/utils";
import elementPlusMessage from "@/utils/elementPlus/elementPlusMessage";
import service from "@/utils/service";

import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import { store, key } from "@/store";

app.config.globalProperties.$moment = moment;
app.config.globalProperties.$router = router;
app.config.globalProperties.$http = service;

app
  .use(router)
  .use(store, key)
  .use(utils)
  .use(ElementPlus)
  .use(elementPlusMessage);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

export default app;
