# AGENTS.md - 开发规范与指南

本文档为 AI 代理提供项目开发规范指导。

## 1. 项目概述

- **项目名称**: uni-preset-vue
- **框架**: uni-app + Vue 3 + Vite
- **主要平台**: H5、微信小程序、多平台小程序

## 2. 构建与运行命令

### 2.1 开发环境

```bash
# H5 开发
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# 其他小程序平台
npm run dev:mp-alipay   # 支付宝
npm run dev:mp-baidu    # 百度
npm run dev:mp-toutiao  # 字节
npm run dev:mp-qq       # QQ
npm run dev:mp-xhs      # 小红书
npm run dev:mp-harmony  # 鸿蒙
```

### 2.2 生产构建

```bash
# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# 其他平台构建
npm run build:mp-alipay
npm run build:mp-baidu
npm run build:mp-toutiao
npm run build:mp-qq
npm run build:mp-xhs
npm run build:mp-harmony
```

### 2.3 注意事项

- 本项目**未配置 lint 和 test 脚本**，如需添加请自行配置 ESLint / Vitest
- 推荐使用 `pnpm` 作为包管理器

## 3. 代码风格规范

### 3.1 Vue 组件规范

**选项式 API vs 组合式 API**
- 简单页面使用选项式 API（与现有代码保持一致）
- 复杂逻辑推荐使用 `<script setup>` + 组合式 API

```vue
<!-- 选项式 API (推荐用于简单组件) -->
<script>
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  methods: {
    handleClick() {
      uni.showToast({ title: "点击" });
    },
  },
};
</script>

<!-- 组合式 API (推荐用于复杂逻辑) -->
<script setup>
import { ref, computed } from "vue";

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>
```

### 3.2 模板规范

- 使用 `view` 替代 `div`（uni-app 小程序兼容）
- 使用 `text` 替代 `span`
- 使用 `{{ }}` 进行数据绑定
- 事件绑定使用 `@click`、`@tap` 等
- 条件渲染使用 `v-if` / `v-show`
- 列表渲染必须使用 `:key`

```vue
<template>
  <view class="container">
    <text class="title">{{ title }}</text>
    
    <view v-for="item in list" :key="item.id" @tap="handleTap(item)">
      {{ item.name }}
    </view>
    
    <view v-if="showFlag" @click="handleClick">点击</view>
    <view v-else>不显示</view>
  </view>
</template>
```

### 3.3 样式规范

- 使用 **Tailwind CSS 4.x** 作为主样式方案
- 小程序特定样式使用 `rpx` 单位
- 兼容样式放在 `<style>` 标签中
- 全局样式在 `src/uni.scss` 中定义

```vue
<style>
/* 使用 Tailwind 类名 */
.bg-white {
  background-color: white;
}

/* 小程序 rpx 单位 */
.logo {
  width: 200rpx;
  height: 200rpx;
}

/* 基础重置 */
view,
text {
  box-sizing: border-box;
}
</style>
```

### 3.4 导入规范

```javascript
// Vue 核心
import { ref, computed, onMounted } from "vue";

// 组件
import MyComponent from "@/components/MyComponent.vue";

// uni-app API
import uni from "@/utils/uni";

// 工具函数
import { formatDate, debounce } from "@/utils";
```

### 3.5 命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 文件名 | kebab-case | `index.vue`, `todo-list.vue` |
| 组件名 | PascalCase | `TodoList`, `DatePicker` |
| 变量/函数 | camelCase | `handleClick`, `todoList` |
| 常量 | UPPER_SNAKE_CASE | `MAX_COUNT`, `API_BASE_URL` |
| CSS 类名 | kebab-case / Tailwind | `todo-item`, `flex justify-center` |

### 3.6 目录结构规范

```
src/
├── pages/              # 页面组件
│   └── index/
│       └── index.vue
├── components/        # 公共组件
├── utils/             # 工具函数
├── App.vue            # 根组件
├── main.js            # 入口文件
└── uni.scss           # 全局样式
```

### 3.7 API 调用规范

- 使用 uni-app 提供的 `uni.request` 进行网络请求
- 统一封装请求拦截器和响应拦截器
- 处理好错误捕获和提示

```javascript
// 推荐封装
uni.request({
  url: 'https://api.example.com',
  method: 'GET',
  success: (res) => {
    console.log(res.data);
  },
  fail: (err) => {
    uni.showToast({ title: '请求失败', icon: 'none' });
  }
});
```

### 3.8 页面跳转规范

```javascript
// 跳转页面
uni.navigateTo({
  url: '/pages/target/index?id=1'
});

// 传递参数
uni.navigateTo({
  url: `/pages/detail/detail?id=${id}&name=${name}`
});

// 接收参数 (在目标页面 onLoad 中)
onLoad(options) {
  console.log(options.id); // "1"
}
```

### 3.9 状态管理

- 简单状态使用组件内 `data` / `ref`
- 跨组件共享状态可使用 Vuex / Pinia
- 页面间传参使用 URL 参数或 `uni.setStorage`

### 3.10 注意事项

1. **小程序兼容**: 避免使用浏览器特有 API，使用 uni-app 提供的跨平台 API
2. **样式隔离**: 注意 Tailwind 类名可能与小程序的内置类名冲突
3. **平台差异**: 不同小程序平台可能有 API 差异，使用条件编译处理
4. **性能优化**: 长列表使用 `scroll-view`，图片使用懒加载

## 4. Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 样式调整
refactor: 代码重构
chore: 构建/工具变动
```

示例: `feat: 添加待办事项删除功能`

## 5. 常用快捷操作

```bash
# 启动 H5 开发
npm run dev:h5

# 构建 H5 生产版本
npm run build:h5

# 构建微信小程序
npm run dev:mp-weixin
```
