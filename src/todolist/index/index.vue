<template>
  <view class="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
    <!-- 顶部状态与日历模块 -->
    <view
      class="bg-white px-5 pt-12 pb-5 border-b border-slate-100 sticky top-0 z-10 shadow-sm"
    >
      <view class="flex justify-between items-center mb-6">
        <text class="text-xl font-extrabold tracking-tight text-slate-800"
          >我的日程</text
        >
        <view
          class="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center"
        >
          <view class="w-2 h-2 bg-indigo-500 rounded-full"></view>
        </view>
      </view>

      <!-- 周日历展示：使用 flex-1 确保平分宽度，适配各种屏幕 -->
      <view class="flex justify-between items-center w-full">
        <view
          v-for="item in weekDays"
          :key="item.fullDate"
          @tap="selectDate(item.fullDate)"
          :class="[
            'flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 w-[13%]',
            selectedDate === item.fullDate
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 scale-105'
              : 'text-slate-400 hover:bg-slate-50',
          ]"
        >
          <text
            :class="[
              'text-[10px] mb-1 font-medium',
              selectedDate === item.fullDate
                ? 'text-indigo-100'
                : 'text-slate-400',
            ]"
          >
            {{ item.dayName }}
          </text>
          <text class="text-sm font-bold">{{ item.dateNum }}</text>
        </view>
      </view>
    </view>

    <!-- 中部待办事项模块 -->
    <scroll-view scroll-y class="flex-1 px-5 py-6 box-border">
      <view class="flex justify-between items-end mb-5">
        <text class="text-lg font-bold text-slate-700"
          >{{ displayDateLabel }} 的待办</text
        >
        <text class="text-xs text-slate-400 font-medium"
          >{{ filteredTodos.length }} 条任务</text
        >
      </view>

      <!-- 任务输入框 -->
      <view class="relative mb-6">
        <input
          v-model="newTodoText"
          placeholder="添加新任务..."
          placeholder-class="text-slate-300"
          class="w-full bg-white h-14 rounded-[24px] pl-5 pr-14 text-sm shadow-sm border border-transparent focus:border-indigo-100 transition-all"
          @confirm="addTodo"
        />
        <view
          class="absolute right-2 top-2 bottom-2 w-10 bg-indigo-500 rounded-[18px] flex items-center justify-center active:bg-indigo-600 transition-colors"
          @tap="addTodo"
        >
          <text class="text-white text-xl font-light">+</text>
        </view>
      </view>

      <!-- 任务列表 -->
      <view class="flex flex-col gap-3">
        <view
          v-if="filteredTodos.length === 0"
          class="flex flex-col items-center justify-center py-16 opacity-40"
        >
          <text class="text-4xl mb-3">📝</text>
          <text class="text-xs tracking-wider">暂无待办事项</text>
        </view>

        <view
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="bg-white p-4 rounded-[22px] flex items-center shadow-sm border border-slate-50 group active:scale-[0.98] transition-transform"
        >
          <view
            @tap="toggleTodo(todo.id)"
            :class="[
              'w-6 h-6 rounded-[8px] border-2 mr-4 flex items-center justify-center transition-all',
              todo.completed
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-slate-200',
            ]"
          >
            <view
              v-if="todo.completed"
              class="w-1.5 h-3 border-r-2 border-b-2 border-white rotate-45 mb-1"
            ></view>
          </view>

          <text
            :class="[
              'flex-1 text-sm font-medium transition-all',
              todo.completed ? 'text-slate-300 line-through' : 'text-slate-600',
            ]"
          >
            {{ todo.text }}
          </text>

          <view
            class="p-1 opacity-20 hover:opacity-100"
            @tap="deleteTodo(todo.id)"
          >
            <text class="text-slate-400 text-lg">×</text>
          </view>
        </view>
      </view>

      <!-- 底部上传模块 -->
      <view
        class="mt-8 bg-white rounded-[32px] p-6 shadow-sm border border-slate-50"
      >
        <text class="text-sm font-bold text-slate-800 mb-4 block"
          >附件上传</text
        >

        <view
          class="border-2 border-dashed border-slate-100 rounded-[24px] py-8 flex flex-col items-center justify-center bg-slate-50/50 active:bg-slate-100 transition-colors"
          @tap="handleUpload"
        >
          <text class="text-3xl mb-2 opacity-60">☁️</text>
          <text class="text-[11px] text-slate-400 font-medium"
            >点击选择文件上传</text
          >
        </view>

        <!-- 已上传列表 -->
        <view v-if="files.length > 0" class="mt-4 flex flex-col gap-2">
          <view
            v-for="file in files"
            :key="file.id"
            class="bg-slate-50 p-3 rounded-2xl flex justify-between items-center"
          >
            <view class="flex flex-col">
              <text
                class="text-[11px] font-bold text-slate-600 truncate max-w-[400rpx]"
                >{{ file.name }}</text
              >
              <text class="text-[9px] text-slate-400">{{ file.size }}</text>
            </view>
            <view
              class="w-6 h-6 flex items-center justify-center"
              @tap="removeFile(file.id)"
            >
              <text class="text-slate-300 text-sm">×</text>
            </view>
          </view>
        </view>
      </view>

      <view class="h-10"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

/**
 * 状态管理
 */
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const newTodoText = ref("");
const todos = ref([
  {
    id: 1,
    text: "整理周报资料",
    completed: false,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: 2,
    text: "设计师对接会议",
    completed: true,
    date: new Date().toISOString().split("T")[0],
  },
]);
const files = ref([]);

/**
 * 日期逻辑：自动计算本周日期
 */
const weekDays = computed(() => {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = now.getDay();
  // 计算本周一的偏移量
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      fullDate: d.toISOString().split("T")[0],
      dayName: ["一", "二", "三", "四", "五", "六", "日"][i],
      dateNum: d.getDate(),
    };
  });
});

/**
 * 显示日期标签
 */
const displayDateLabel = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  if (selectedDate.value === today) return "今天";
  const parts = selectedDate.value.split("-");
  return `${parts[1]}/${parts[2]}`;
});

/**
 * 过滤后的待办列表
 */
const filteredTodos = computed(() => {
  return todos.value.filter((t) => t.date === selectedDate.value);
});

/**
 * 方法处理
 */
const selectDate = (date) => {
  selectedDate.value = date;
};

const addTodo = () => {
  if (!newTodoText.value.trim()) return;
  todos.value.push({
    id: Date.now(),
    text: newTodoText.value,
    completed: false,
    date: selectedDate.value,
  });
  newTodoText.value = "";
};

const toggleTodo = (id) => {
  const index = todos.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.value[index].completed = !todos.value[index].completed;
  }
};

const deleteTodo = (id) => {
  todos.value = todos.value.filter((t) => t.id !== id);
};

const handleUpload = () => {
  // 调用 uni-app 原生文件选择 API
  uni.chooseFile({
    count: 5,
    type: "all",
    success: (res) => {
      const newFiles = res.tempFiles.map((f) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB",
      }));
      files.value = [...files.value, ...newFiles];
      uni.showToast({ title: "上传成功", icon: "success" });
    },
  });
};

const removeFile = (id) => {
  files.value = files.value.filter((f) => f.id !== id);
};
</script>

<style>
/* 由于使用了 Tailwind CSS 风格的 Utility Classes，
  大部分样式已移至 template。
  保留极简的基础重置。
*/
view,
text {
  box-sizing: border-box;
}

/* 隐藏 scroll-view 滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
