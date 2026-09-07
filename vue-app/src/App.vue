<script setup>
// 练习 3：Vue 基础语法 —— 综合案例「待办事项 TodoList」
// 使用组合式 API（Composition API / <script setup>）
// 一个案例覆盖 8 个核心语法点：
//   ① 插值 {{ }}  ② v-bind  ③ v-on  ④ v-model
//   ⑤ v-if/v-else  ⑥ v-for  ⑦ computed  ⑧ watch
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'vue-todos'

/* ---------- 响应式数据 ---------- */
// ④ v-model 双向绑定的输入内容
const newTodo = ref('')
// ⑤ v-if/v-else 条件渲染用的过滤状态
const filter = ref('all')
// ⑥ v-for 循环渲染的数据源
const DEFAULT_TODOS = [
  { id: 1, title: '学习插值语法 {{ }}', done: false },
  { id: 2, title: '学习 v-bind 属性绑定', done: false },
  { id: 3, title: '学习 v-on 事件绑定', done: true }
]
// 优先从 localStorage 读取历史数据（配合 ⑧ watch 持久化）
const saved = localStorage.getItem(STORAGE_KEY)
const todos = ref(saved ? JSON.parse(saved) : DEFAULT_TODOS)

// 过滤 tab 配置（⑤ v-if/v-else + ⑥ v-for 共同使用）
const filters = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'done' }
]

/* ---------- ⑦ computed 计算属性 ---------- */
// 根据 filter 筛选展示的列表
const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter((t) => !t.done)
  if (filter.value === 'done') return todos.value.filter((t) => t.done)
  return todos.value
})
// 统计未完成 / 已完成数量
const activeCount = computed(() => todos.value.filter((t) => !t.done).length)
const doneCount = computed(() => todos.value.filter((t) => t.done).length)

/* ---------- ⑧ watch 侦听器 ---------- */
// 监听 todos 变化（含深层属性），自动保存到 localStorage 实现持久化
watch(
  todos,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true }
)

/* ---------- 方法（② v-on 事件绑定调用） ---------- */
let nextId = todos.value.length ? Math.max(...todos.value.map((t) => t.id)) + 1 : 1
function addTodo() {
  const title = newTodo.value.trim()
  if (!title) return
  todos.value.push({ id: nextId++, title, done: false })
  newTodo.value = ''
}
function toggleTodo(id) {
  const t = todos.value.find((t) => t.id === id)
  if (t) t.done = !t.done
}
function removeTodo(id) {
  todos.value = todos.value.filter((t) => t.id !== id)
}
function clearDone() {
  todos.value = todos.value.filter((t) => !t.done)
}
</script>

<template>
  <div class="todo-app">
    <h1>📝 Vue 基础语法 · 待办事项</h1>
    <p class="sub">一个案例覆盖 8 个语法点：插值 / v-bind / v-on / v-if / v-for / v-model / computed / watch</p>

    <!-- ④ v-model 双向绑定 + ② v-on 事件（回车或点按钮） -->
    <div class="input-row">
      <input
        v-model="newTodo"
        type="text"
        placeholder="输入待办事项，回车或点「添加」"
        @keyup.enter="addTodo"
      />
      <button class="add" @click="addTodo">添加</button>
    </div>

    <!-- ⑥ v-for + ③ v-bind:class 动态高亮当前 tab + ② v-on 切换 -->
    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ active: filter === f.value }"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- ⑤ v-if（有数据时显示列表） + ⑥ v-for 渲染 -->
    <ul v-if="filteredTodos.length" class="todo-list">
      <li v-for="item in filteredTodos" :key="item.id" :class="{ done: item.done }">
        <!-- ③ v-bind:checked + ② v-on:change 切换完成状态 -->
        <input type="checkbox" :checked="item.done" @change="toggleTodo(item.id)" />
        <!-- ① 插值显示标题 -->
        <span class="title">{{ item.title }}</span>
        <button class="del" @click="removeTodo(item.id)">删除</button>
      </li>
    </ul>
    <!-- ⑤ v-else 空状态 -->
    <p v-else class="empty">暂无待办事项 🎉</p>

    <!-- ⑦ computed 展示统计结果 -->
    <div class="footer">
      <span>未完成 <b>{{ activeCount }}</b> · 已完成 <b>{{ doneCount }}</b></span>
      <button v-if="doneCount" class="clear" @click="clearDone">清除已完成</button>
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
h1 {
  font-size: 22px;
  margin: 0 0 4px;
  color: #42b883;
}
.sub {
  color: #909399;
  font-size: 13px;
  margin: 0 0 24px;
  line-height: 1.6;
}
.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.input-row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.input-row input:focus {
  border-color: #42b883;
}
button {
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #303133;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}
button.add {
  background: #42b883;
  color: #fff;
  border-color: #42b883;
}
button.add:hover {
  background: #3aa876;
}
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.filters button.active {
  background: #42b883;
  color: #fff;
  border-color: #42b883;
}
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.todo-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}
.todo-list li .title {
  flex: 1;
  font-size: 15px;
}
/* ③ v-bind:class 动态绑定 done 类，完成项划线置灰 */
.todo-list li.done .title {
  text-decoration: line-through;
  color: #c0c4cc;
}
.todo-list input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: #42b883;
  cursor: pointer;
}
button.del {
  color: #f56c6c;
  border-color: #fde2e2;
  background: #fef0f0;
}
button.del:hover {
  background: #fde2e2;
}
.empty {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  color: #909399;
  font-size: 14px;
}
.footer b {
  color: #42b883;
}
button.clear {
  color: #f56c6c;
  border: none;
  background: transparent;
  padding: 4px 8px;
}
button.clear:hover {
  text-decoration: underline;
}
</style>
