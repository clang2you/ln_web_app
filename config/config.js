// https://umijs.org/config/
import { defineConfig } from 'umi';
// defaultSettings 是默认的颜色主题 / 显示样式等设置
import defaultSettings from './defaultSettings';
// xhr 访问代理设置
import proxy from './proxy';
// 路由配置文件
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // 路由选择为 browser router，也可配置为 hash router
  history: {
    type: 'browser',
  },
  // 多国语言配置
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  // 按需引入
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
