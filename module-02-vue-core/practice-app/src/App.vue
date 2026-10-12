<script setup>
// 课堂项目入口：在多个子页面之间切换（views 目录按单元分组存放子页面）
// 本次作业页面：views/unit-05/StudentList.vue —— 学生数据多视图渲染（v-if / v-else-if / v-else + Element Plus）
import StudentList from './views/unit-05/StudentList.vue'
// import TodoList from './views/unit-05/TodoList.vue'
</script>

<template>
  <StudentList />
</template>
