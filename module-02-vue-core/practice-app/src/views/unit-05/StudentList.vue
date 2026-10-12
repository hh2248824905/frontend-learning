<script setup>
// 组合式 API 必须显式导入：ref 定义响应式数据，computed 定义计算属性
import { ref, computed } from 'vue'
// ElMessage / ElMessageBox 是函数式组件，不在模板里写标签，只能从包里导入后用 JS 调用
import { ElMessage, ElMessageBox } from 'element-plus'

const DEFAULT_STUDENTS = [
  { id: '2026001', name: '张伟', className: '计算机2301', direction: '前端开发', score: 92, status: 1, avatar: '/images/avatar-01.svg', gender: '男', phone: '138****0001', email: 'zhangwei@example.com', joinDate: '2023-09-01' },
  { id: '2026002', name: '李静', className: '计算机2301', direction: '后端开发', score: 88, status: 1, avatar: '/images/avatar-02.svg', gender: '女', phone: '138****0002', email: 'lijing@example.com', joinDate: '2023-09-01' },
  { id: '2026003', name: '王强', className: '计算机2302', direction: '前端开发', score: 76, status: 1, avatar: '/images/avatar-03.svg', gender: '男', phone: '138****0003', email: 'wangqiang@example.com', joinDate: '2023-09-01' },
  { id: '2026004', name: '赵敏', className: '计算机2302', direction: 'UI 设计', score: 95, status: 1, avatar: '/images/avatar-04.svg', gender: '女', phone: '138****0004', email: 'zhaomin@example.com', joinDate: '2023-09-02' },
  { id: '2026005', name: '孙磊', className: '软件2301', direction: '移动开发', score: 61, status: 0, avatar: '/images/avatar-05.svg', gender: '男', phone: '138****0005', email: 'sunlei@example.com', joinDate: '2023-09-02' },
  { id: '2026006', name: '周雨', className: '软件2301', direction: '前端开发', score: 84, status: 1, avatar: '/images/avatar-06.svg', gender: '女', phone: '138****0006', email: 'zhouyu@example.com', joinDate: '2023-09-03' },
  { id: '2026007', name: '吴迪', className: '软件2302', direction: '测试开发', score: 57, status: 0, avatar: '/images/avatar-07.svg', gender: '男', phone: '138****0007', email: 'wudi@example.com', joinDate: '2023-09-03' },
  { id: '2026008', name: '郑爽', className: '软件2302', direction: '后端开发', score: 79, status: 1, avatar: '/images/avatar-08.svg', gender: '女', phone: '138****0008', email: 'zhengshuang@example.com', joinDate: '2023-09-04' },
  { id: '2026009', name: '陈晨', className: '网络2301', direction: '运维开发', score: 90, status: 1, avatar: '/images/avatar-03.svg', gender: '男', phone: '138****0009', email: 'chenchen@example.com', joinDate: '2023-09-04' },
  { id: '2026010', name: '林峰', className: '网络2301', direction: '前端开发', score: 68, status: 1, avatar: '/images/avatar-06.svg', gender: '男', phone: '138****0010', email: 'linfeng@example.com', joinDate: '2023-09-05' }
]
const students = ref(DEFAULT_STUDENTS.map((s) => ({ ...s })))


const viewMode = ref('table') // table | card | list | group

const viewOptions = [
  { label: '表格模式', value: 'table', icon: 'iconfont-table', tip: 'el-table 逐行显示，成绩可排序' },
  { label: '卡片模式', value: 'card', icon: 'iconfont-card', tip: 'el-card 块状显示，窄屏自动换列' },
  { label: '名单模式', value: 'list', icon: 'iconfont-list', tip: '一行一人，紧凑排列快速扫读' },
  { label: '分组模式', value: 'group', icon: 'iconfont-direction', tip: '按专业方向分组（延伸练习 ③ 新增的 v-else-if 分支）' }
]


function switchView(mode) {
  viewMode.value = mode
}


const onlyPass = ref(false)


const visibleStudents = computed(() =>
  onlyPass.value ? students.value.filter((s) => s.score >= 60) : students.value
)


const groupedStudents = computed(() => {
  const map = new Map()
  for (const s of visibleStudents.value) {
    if (!map.has(s.direction)) map.set(s.direction, [])
    map.get(s.direction).push(s)
  }
  // 转成数组并附带该组的统计数据
  return [...map.entries()].map(([direction, list]) => {
    const sum = list.reduce((acc, s) => acc + s.score, 0)
    return {
      direction,
      list,
      count: list.length,
      avg: (sum / list.length).toFixed(1),
      max: Math.max(...list.map((s) => s.score))
    }
  })
})

/* ============ ⑤ 查看详情：el-dialog + 一个 ref 保存选中的学生 ============ */
const detailVisible = ref(false)
const currentStudent = ref(null)

function openDetail(row) {
  currentStudent.value = row
  detailVisible.value = true
}

/* ============ 状态 / 成绩的展示映射 ============ */
const STATUS_TEXT = { 1: '在读', 0: '结业' }

// 成绩等级：用于卡片与名单的标签配色
function scoreType(score) {
  if (score >= 90) return 'success'
  if (score >= 75) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

function statusType(status) {
  return status === 1 ? 'success' : 'info'
}

/* 成绩等级文字（详情弹窗里用） */
function scoreLevel(score) {
  if (score >= 90) return '优秀'
  if (score >= 75) return '良好'
  if (score >= 60) return '及格'
  return '不及格'
}

/* ============ 表头统计（所有视图共用；跟随「只看及格」开关变化） ============ */
const stats = computed(() => {
  const list = visibleStudents.value
  const sum = list.reduce((acc, s) => acc + s.score, 0)
  return {
    total: list.length,
    avg: list.length ? (sum / list.length).toFixed(1) : 0,
    max: list.length ? Math.max(...list.map((s) => s.score)) : 0,
    pass: list.filter((s) => s.score >= 60).length
  }
})

/* 头像文字：取姓名最后一个字（无头像图时用文字兜底） */
function avatarText(name) {
  return name ? name.slice(-1) : '?'
}

/* ============ 简单交互：切换状态（验证"数据统一"） ============ */
function toggleStatus(row) {
  row.status = row.status === 1 ? 0 : 1
  ElMessage.success(`${row.name} 已标记为「${STATUS_TEXT[row.status]}」`)
}

/* ============ 成绩排序回调（el-table 表头排序） ============ */
function sortByScore({ order }) {
  if (!order) {
    students.value.sort((a, b) => a.id.localeCompare(b.id))
    return
  }
  students.value.sort((a, b) => (order === 'ascending' ? a.score - b.score : b.score - a.score))
}

/* ============ 演示 v-once 之外的一个删除操作，验证四视图同步 ============ */
function removeStudent(id, name) {
  ElMessageBox.confirm(`确定移除学生「${name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      students.value = students.value.filter((s) => s.id !== id)
      ElMessage.success('已移除')
    })
    .catch(() => {})
}

/* 空状态里的「恢复示例数据」：证明数据源可复原，视图立即跟随 */
function resetStudents() {
  students.value = DEFAULT_STUDENTS.map((s) => ({ ...s }))
  onlyPass.value = false
  ElMessage.success('已恢复示例数据')
}
</script>

<template>
  <div class="student-page">
    <!-- ============ 页头：横幅插画 ============ -->
    <header class="page-head">
      <img class="banner" src="/images/banner-students.svg" alt="学生名单 · 多视图渲染" />
    </header>

    <!-- ============ 页面顶部按钮组：切换四种显示方式 ============ -->
    <div class="toolbar">
      <el-radio-group v-model="viewMode" size="large" @change="switchView">
        <el-radio-button
          v-for="opt in viewOptions"
          :key="opt.value"
          :value="opt.value"
        >
          <svg class="icon" aria-hidden="true"><use :href="`/icons.svg#${opt.icon}`" /></svg>
          {{ opt.label }}
        </el-radio-button>
      </el-radio-group>

      <div class="toolbar-right">
        <!-- ④ 只看及格开关：el-switch + ref，切换后所有视图同步过滤 -->
        <el-switch
          v-model="onlyPass"
          active-text="只看及格"
          inline-prompt
          style="--el-switch-on-color: #42b883"
        />

        <div class="stats">
          <el-tag type="info" effect="plain">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-team" /></svg>
            {{ onlyPass ? '及格' : '共' }} {{ stats.total }} 人
          </el-tag>
          <el-tag type="primary" effect="plain">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-chart" /></svg>
            平均分 {{ stats.avg }}
          </el-tag>
          <el-tag type="success" effect="plain">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-score" /></svg>
            最高 {{ stats.max }}
          </el-tag>
        </div>
      </div>
    </div>

    <p class="mode-tip">
      当前：<b>{{ viewOptions.find((o) => o.value === viewMode)?.tip }}</b>
      <span v-if="onlyPass" class="filter-hint">（已过滤：仅显示成绩 ≥ 60 的学生）</span>
    </p>

    <!-- ============ ② v-if / v-else-if / v-else 四种渲染方式 ============ -->

    <!-- 表格模式：el-table 逐行显示，成绩可排序 -->
    <el-table
      v-if="viewMode === 'table' && visibleStudents.length"
      :data="visibleStudents"
      border
      stripe
      :default-sort="{ prop: 'score', order: 'descending' }"
      @sort-change="sortByScore"
      class="mode-table"
    >
      <el-table-column prop="id" label="学号" width="110" sortable />
      <el-table-column label="姓名" width="120">
        <template #header>
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-user" /></svg>
          姓名
        </template>
        <template #default="{ row }">
          <div class="cell-name">
            <img :src="row.avatar" :alt="row.name" class="cell-avatar" />
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="className" label="班级" width="140">
        <template #header>
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-class" /></svg>
          班级
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="方向" width="120">
        <template #header>
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-direction" /></svg>
          方向
        </template>
      </el-table-column>
      <el-table-column prop="score" label="成绩" width="130" sortable>
        <template #header>
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-score" /></svg>
          成绩
        </template>
        <template #default="{ row }">
          <el-tag :type="scoreType(row.score)" effect="dark" size="small">{{ row.score }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template #header>
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-check" /></svg>
          状态
        </template>
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">
            {{ STATUS_TEXT[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template #default="{ row }">
          <!-- ⑤ 查看详情：打开 el-dialog -->
          <el-button link type="primary" size="small" @click="openDetail(row)">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-user" /></svg>
            查看详情
          </el-button>
          <el-button link type="warning" size="small" @click="toggleStatus(row)">
            {{ row.status === 1 ? '标记结业' : '恢复在读' }}
          </el-button>
          <el-button link type="danger" size="small" @click="removeStudent(row.id, row.name)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 卡片模式：el-card 块状显示，一人一卡，窄屏自动换列 -->
    <div v-else-if="viewMode === 'card' && visibleStudents.length" class="mode-card">
      <el-card v-for="s in visibleStudents" :key="s.id" shadow="hover" class="stu-card">
        <div class="card-cover">
          <img :src="s.avatar" :alt="s.name" class="card-avatar" />
          <el-tag :type="statusType(s.status)" size="small" round class="cover-tag">
            {{ STATUS_TEXT[s.status] }}
          </el-tag>
        </div>

        <div class="card-title">
          <h3>{{ s.name }}</h3>
          <span class="sid">{{ s.id }}</span>
        </div>

        <el-divider />

        <ul class="card-info">
          <li>
            <span class="k">
              <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-class" /></svg>
              班级
            </span>
            <span class="v">{{ s.className }}</span>
          </li>
          <li>
            <span class="k">
              <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-direction" /></svg>
              方向
            </span>
            <span class="v">{{ s.direction }}</span>
          </li>
          <li>
            <span class="k">
              <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-score" /></svg>
              成绩
            </span>
            <span class="v">
              <el-tag :type="scoreType(s.score)" effect="dark" size="small">{{ s.score }}</el-tag>
            </span>
          </li>
        </ul>

        <div class="card-foot">
          <el-button size="small" type="primary" plain @click="openDetail(s)">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-user" /></svg>
            查看详情
          </el-button>
          <el-button size="small" @click="toggleStatus(s)">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-check" /></svg>
            {{ s.status === 1 ? '标记结业' : '恢复在读' }}
          </el-button>
          <el-button size="small" type="danger" plain @click="removeStudent(s.id, s.name)">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-delete" /></svg>
            移除
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 名单模式：一行一人，紧凑排列，人多也能快速扫读 -->
    <div v-else-if="viewMode === 'list' && visibleStudents.length" class="mode-list">
      <div class="list-head">
        <span class="idx">#</span>
        <span class="avatar-col"></span>
        <span class="name">姓名</span>
        <span class="sid">学号</span>
        <span class="cls">班级</span>
        <span class="dir">方向</span>
        <span class="score">成绩</span>
        <span class="status">状态</span>
        <span class="op">操作</span>
      </div>
      <div v-for="(s, i) in visibleStudents" :key="s.id" class="list-row">
        <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
        <el-avatar :size="30" :src="s.avatar" class="mini-avatar">{{ avatarText(s.name) }}</el-avatar>
        <span class="name">{{ s.name }}</span>
        <span class="sid">{{ s.id }}</span>
        <span class="cls">
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-class" /></svg>
          {{ s.className }}
        </span>
        <span class="dir">
          <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-direction" /></svg>
          {{ s.direction }}
        </span>
        <el-tag :type="scoreType(s.score)" effect="dark" size="small" class="score">
          {{ s.score }}
        </el-tag>
        <el-tag :type="statusType(s.status)" size="small" class="status">
          {{ STATUS_TEXT[s.status] }}
        </el-tag>
        <span class="op">
          <el-button link type="primary" size="small" @click="openDetail(s)">详情</el-button>
        </span>
      </div>
    </div>

    <!-- ③ 延伸练习：按专业方向分组显示（条件判断链上追加的 v-else-if 分支） -->
    <div v-else-if="viewMode === 'group' && groupedStudents.length" class="mode-group">
      <section v-for="g in groupedStudents" :key="g.direction" class="group-block">
        <div class="group-head">
          <span class="group-title">
            <svg class="icon" aria-hidden="true"><use href="/icons.svg#iconfont-direction" /></svg>
            {{ g.direction }}
          </span>
          <span class="group-meta">
            <el-tag size="small" effect="plain" type="info">{{ g.count }} 人</el-tag>
            <el-tag size="small" effect="plain" type="primary">均分 {{ g.avg }}</el-tag>
            <el-tag size="small" effect="plain" type="success">最高 {{ g.max }}</el-tag>
          </span>
        </div>

        <div class="group-body">
          <div
            v-for="s in g.list"
            :key="s.id"
            class="group-item"
            @click="openDetail(s)"
          >
            <img :src="s.avatar" :alt="s.name" class="group-avatar" />
            <div class="group-info">
              <span class="gname">{{ s.name }}</span>
              <span class="gsid">{{ s.id }} · {{ s.className }}</span>
            </div>
            <el-tag :type="scoreType(s.score)" effect="dark" size="small">{{ s.score }}</el-tag>
            <el-tag :type="statusType(s.status)" size="small">{{ STATUS_TEXT[s.status] }}</el-tag>
          </div>
        </div>
      </section>
    </div>

    <!-- 兜底分支：数据被清空 / 过滤后无结果时显示空状态插图 -->
    <div v-else class="empty-state">
      <img src="/images/empty-state.svg" alt="暂无数据" />
      <p>{{ onlyPass ? '当前没有及格的学生，试试关闭「只看及格」' : '暂无学生数据' }}</p>
      <el-button v-if="onlyPass" type="primary" plain @click="onlyPass = false">
        关闭「只看及格」
      </el-button>
      <el-button v-else type="primary" plain @click="resetStudents">恢复示例数据</el-button>
    </div>
  </div>

  <!-- ⑤ 查看详情对话框：el-dialog + currentStudent 保存选中的学生 -->
  <el-dialog
    v-model="detailVisible"
    :title="currentStudent ? `${currentStudent.name} · 学生详情` : '学生详情'"
    width="460px"
  >
    <div v-if="currentStudent" class="detail">
      <div class="detail-head">
        <img :src="currentStudent.avatar" :alt="currentStudent.name" class="detail-avatar" />
        <div class="detail-name">
          <h3>{{ currentStudent.name }}</h3>
          <span class="dsid">{{ currentStudent.id }}</span>
        </div>
        <el-tag :type="statusType(currentStudent.status)" round>
          {{ STATUS_TEXT[currentStudent.status] }}
        </el-tag>
      </div>

      <el-divider />

      <ul class="detail-list">
        <li><span class="k">班级</span><span class="v">{{ currentStudent.className }}</span></li>
        <li><span class="k">专业方向</span><span class="v">{{ currentStudent.direction }}</span></li>
        <li><span class="k">性别</span><span class="v">{{ currentStudent.gender }}</span></li>
        <li>
          <span class="k">成绩</span>
          <span class="v">
            <el-tag :type="scoreType(currentStudent.score)" effect="dark" size="small">
              {{ currentStudent.score }}
            </el-tag>
            <span class="level">{{ scoreLevel(currentStudent.score) }}</span>
          </span>
        </li>
        <li><span class="k">状态</span><span class="v">{{ STATUS_TEXT[currentStudent.status] }}</span></li>
        <li><span class="k">联系电话</span><span class="v">{{ currentStudent.phone }}</span></li>
        <li><span class="k">邮箱</span><span class="v">{{ currentStudent.email }}</span></li>
        <li><span class="k">入学日期</span><span class="v">{{ currentStudent.joinDate }}</span></li>
      </ul>
    </div>

    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
      <el-button type="primary" @click="toggleStatus(currentStudent); detailVisible = false">
        切换状态
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.student-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}

/* ---------- 页头横幅插画 ---------- */
.page-head {
  margin-bottom: 20px;
}
.banner {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(66, 184, 131, 0.18);
}
.icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  flex-shrink: 0;
  vertical-align: -0.125em;
}
/* Element Plus 的按钮/标签内部用 flex 布局，图标与文字需要一个间距 */
:deep(.el-button) .icon,
:deep(.el-tag) .icon,
:deep(.el-radio-button__inner) .icon {
  margin-right: 4px;
}
:deep(.el-table__header) .icon {
  margin-right: 4px;
  color: #909399;
}
.sub {
  color: #909399;
  font-size: 13px;
  margin: 0;
}

/* ---------- 顶部按钮组 ---------- */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
/* 工具栏右侧：只看及格开关 + 统计条 */
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.filter-hint {
  color: #e6a23c;
}
.mode-tip {
  font-size: 13px;
  color: #909399;
  margin: 12px 2px 16px;
}
.mode-tip b {
  color: #42b883;
}

/* ---------- 表格模式 ---------- */
.mode-table {
  width: 100%;
}
.cell-name {
  display: flex;
  align-items: center;
  gap: 8px;
}
/* 表格里的头像图片 */
.cell-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  border: 1.5px solid #e8f7f0;
}
.mini-avatar {
  flex-shrink: 0;
}

/* ---------- 卡片模式：窄屏自动换列 ---------- */
.mode-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.stu-card {
  transition: transform 0.2s;
}
.stu-card:hover {
  transform: translateY(-3px);
}
.card-cover {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 6px 0 2px;
}
/* 卡片头像图片 */
.card-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e8f7f0;
  transition: transform 0.25s;
}
.stu-card:hover .card-avatar {
  transform: scale(1.06);
}
.cover-tag {
  position: absolute;
  right: 0;
  top: 6px;
}
.card-title {
  text-align: center;
  margin-top: 10px;
}
.card-title h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}
.sid {
  font-size: 12px;
  color: #909399;
  font-family: ui-monospace, Consolas, monospace;
}
.card-info {
  list-style: none;
  margin: 0;
  padding: 0;
}
.card-info li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
}
.card-info .k {
  color: #909399;
}
.card-info .v {
  color: #303133;
}
.card-foot {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

/* ---------- 名单模式：一行一人，紧凑 ---------- */
.mode-list {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 18px;
  border-bottom: 1px solid #f5f7fa;
  font-size: 14px;
  transition: background 0.15s;
}
/* 名单表头 */
.list-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
  color: #909399;
  font-weight: 600;
}
.list-head .idx {
  width: 26px;
}
.list-head .avatar-col {
  width: 30px;
}
.list-head .name {
  width: 76px;
}
.list-head .sid {
  width: 100px;
}
.list-head .cls {
  width: 142px;
}
.list-head .dir {
  flex: 1;
}
.list-head .score,
.list-head .status {
  flex-shrink: 0;
}
.list-head .score {
  width: 44px;
}
.list-head .status {
  width: 46px;
}
.list-head .op {
  width: 52px;
  flex-shrink: 0;
}
.list-row .op {
  width: 52px;
  flex-shrink: 0;
}
.list-row:last-child {
  border-bottom: none;
}
.list-row:hover {
  background: #f0f9eb;
}
.list-row .idx {
  width: 26px;
  color: #c0c4cc;
  font-size: 12px;
  font-family: ui-monospace, Consolas, monospace;
}
.list-row .name {
  width: 76px;
  font-weight: 600;
  color: #303133;
}
.list-row .sid {
  width: 100px;
}
.list-row .cls {
  width: 142px;
  color: #606266;
  display: flex;
  align-items: center;
}
.list-row .dir {
  flex: 1;
  color: #909399;
  font-size: 13px;
  display: flex;
  align-items: center;
}
.list-row .cls .icon,
.list-row .dir .icon {
  margin-right: 4px;
  color: #c0c4cc;
}
.list-row .score,
.list-row .status {
  flex-shrink: 0;
}

/* ---------- 空状态插图 ---------- */
.empty-state {
  text-align: center;
  padding: 48px 0;
}
.empty-state img {
  width: 200px;
  max-width: 70%;
  height: auto;
  margin-bottom: 14px;
}
.empty-state p {
  color: #909399;
  font-size: 14px;
  margin: 0 0 16px;
}

/* ---------- 分组模式：按专业方向分组显示 ---------- */
.mode-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.group-block {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #f0f9eb;
  border-bottom: 1px solid #e1f3d8;
  flex-wrap: wrap;
  gap: 8px;
}
.group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #3aa876;
}
.group-title .icon {
  color: #42b883;
}
.group-meta {
  display: flex;
  gap: 6px;
}
.group-body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
  padding: 14px 18px;
}
.group-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.18s;
  border: 1px solid transparent;
}
.group-item:hover {
  background: #f0f9eb;
  border-color: #c2e7b0;
  transform: translateX(2px);
}
.group-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  border: 1.5px solid #e8f7f0;
}
.group-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.gname {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.gsid {
  font-size: 11px;
  color: #909399;
}

/* ---------- 查看详情对话框 ---------- */
.detail-head {
  display: flex;
  align-items: center;
  gap: 14px;
}
.detail-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e8f7f0;
}
.detail-name {
  flex: 1;
  min-width: 0;
}
.detail-name h3 {
  margin: 0 0 2px;
  font-size: 18px;
  color: #303133;
}
.dsid {
  font-size: 12px;
  color: #909399;
  font-family: ui-monospace, Consolas, monospace;
}
.detail-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.detail-list li {
  display: flex;
  align-items: center;
  padding: 9px 0;
  font-size: 13px;
  border-bottom: 1px dashed #f0f2f5;
}
.detail-list li:last-child {
  border-bottom: none;
}
.detail-list .k {
  width: 84px;
  color: #909399;
  flex-shrink: 0;
}
.detail-list .v {
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}
.detail-list .level {
  font-size: 12px;
  color: #909399;
}

/* ---------- 窄屏适配 ---------- */
@media (max-width: 720px) {
  .mode-card {
    grid-template-columns: 1fr;
  }
  .group-body {
    grid-template-columns: 1fr;
  }
  .list-row .cls,
  .list-row .dir {
    display: none;
  }
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
