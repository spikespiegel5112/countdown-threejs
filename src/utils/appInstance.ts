import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import utils from "@/utils/utils";
import service from "@/utils/service";

const app = createApp(App);

import moment from "moment";
// import "moment/locale/zh-cn";
// moment.locale("zh-cn");
import { store, key } from "@/store";

app.config.globalProperties.$moment = moment;
app.config.globalProperties.$router = router;
app.config.globalProperties.$http = service;

app.use(router).use(store, key).use(utils);


export default app;
