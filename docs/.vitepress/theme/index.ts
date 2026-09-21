import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue';
import OpenSourceProjects from './components/OpenSourceProjects.vue';
import HomeOpenSourceProjects from './components/HomeOpenSourceProjects.vue';
import './styles/vars.css';
import './styles/custom.css';
import axios from 'axios';
import api from './api/index';

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    // extend default theme custom behaviour.
    DefaultTheme.enhanceApp(ctx);

    ctx.app.component('OpenSourceProjects', OpenSourceProjects);
    ctx.app.component('HomeOpenSourceProjects', HomeOpenSourceProjects);

    // 全局挂载 API 接口
    ctx.app.config.globalProperties.$http = axios
    if (typeof window !== 'undefined') {
        window.$api = api;
    }

    // register your custom global components
    // ctx.app.component('MyGlobalComponent' /* ... */)
  }
}
