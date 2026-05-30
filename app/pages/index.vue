<template>
  <div class=" space-y-3  mx-auto">
    <!-- Header -->
    <WelcomeHero />

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          </div>
          <UIcon :name="stat.icon" class="w-10 h-10 text-primary-500 opacity-80" />
        </div>
        <div class="mt-3 flex items-center text-xs">
          <UBadge :color="stat.trend > 0 ? 'green' : 'red'" variant="subtle" size="xs">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </UBadge>
          <span class="ml-2 text-gray-500">vs last month</span>
        </div>
      </UCard>
    </div>

    <!-- Charts Row 1: CPU/Memory & Bandwidth -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <!-- Server Load Chart -->
      <UCard class="lg:col-span-2" :ui="{ body: { padding: '!p-4' } }">
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Server Load (CPU & RAM)</h3>
        </template>
        <ClientOnly>
          <apexchart type="area" height="300" :options="loadChartOptions" :series="loadSeries" />
          <template #fallback>
            <div class="h-[300px] flex items-center justify-center">
              <UIcon name="i-heroicons-circle-stack" class="animate-spin w-8 h-8 text-primary-500" />
            </div>
          </template>
        </ClientOnly>
      </UCard>

      <!-- Resource Allocation Gauge -->
      <UCard :ui="{ body: { padding: '!p-4' } }">
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Disk Usage</h3>
        </template>
        <ClientOnly>
          <apexchart type="radialBar" height="300" :options="diskChartOptions" :series="diskSeries" />
        </ClientOnly>
        <div class="text-center -mt-4">
          <p class="text-sm text-gray-500">45.2 GB / 100 GB NVMe</p>
        </div>
      </UCard>
    </div>

    <!-- Charts Row 2: Bandwidth & Activity Log -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <!-- Bandwidth Chart -->
      <UCard class="lg:col-span-2" :ui="{ body: { padding: '!p-4' } }">
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Monthly Bandwidth Transfer</h3>
        </template>
        <ClientOnly>
          <apexchart type="bar" height="280" :options="bandwidthChartOptions" :series="bandwidthSeries" />
        </ClientOnly>
      </UCard>

      <!-- Recent Activity Feed -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </template>
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
            <div class="mt-0.5">
              <UIcon :name="activity.icon" class="w-5 h-5" :class="activity.color" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ activity.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
        <UButton block variant="ghost" size="sm" class="mt-4">View All Logs</UButton>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import WelcomeHero from '~/components/dashboard/WelcomeHero.vue'

// Register component locally (or do it globally in plugin)
const apexchart = VueApexCharts

definePageMeta({
  layout: 'default', // Change to your admin/dashboard layout
})

useHead({ title: 'Hosting Dashboard' })

// --- State ---
const refreshing = ref(false)

// --- Mock KPI Data ---
const stats = [
  { label: 'Uptime', value: '99.98%', icon: 'i-heroicons-signal', trend: 0.02 },
  { label: 'Active Sites', value: '12', icon: 'i-heroicons-globe-alt', trend: 8.3 },
  { label: 'Avg Response', value: '142ms', icon: 'i-heroicons-bolt', trend: -12.5 },
  { label: 'SSL Certs', value: '12/12', icon: 'i-heroicons-shield-check', trend: 0 },
]

// --- Mock Activity Data ---
const activities = [
  { id: 1, title: 'Auto-backup completed', time: '2 hours ago', icon: 'i-heroicons-cloud-arrow-up', color: 'text-green-500' },
  { id: 2, title: 'SSL renewed for api.example.com', time: '5 hours ago', icon: 'i-heroicons-shield-check', color: 'text-blue-500' },
  { id: 3, title: 'High CPU usage detected', time: '1 day ago', icon: 'i-heroicons-exclamation-triangle', color: 'text-orange-500' },
  { id: 4, title: 'New SSH login from 192.168.x.x', time: '1 day ago', icon: 'i-heroicons-computer-desktop', color: 'text-purple-500' },
  { id: 5, title: 'Deployment #482 successful', time: '2 days ago', icon: 'i-heroicons-rocket-launch', color: 'text-green-500' },
]

// --- Chart Theme Helpers ---
const getThemeColor = (shade: number) => {
  // In production, use useAppConfig() or CSS variables for true theme reactivity
  return shade === 500 ? '#6366f1' : '#a5b4fc'
}

// --- 1. Server Load (Area Chart) ---
const loadSeries = ref([
  { name: 'CPU %', data: [32, 45, 38, 52, 48, 61, 55, 42, 38, 51, 62, 45] },
  { name: 'RAM %', data: [65, 68, 72, 71, 74, 78, 76, 73, 70, 72, 75, 71] }
])

const loadChartOptions = computed(() => ({
  chart: { toolbar: { show: false }, background: 'transparent' },
  colors: ['#6366f1', '#10b981'],
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  tooltip: { theme: 'dark' },
  legend: { position: 'top' }
}))

// --- 2. Disk Usage (Radial Bar) ---
const diskSeries = ref([45.2])
const diskChartOptions = computed(() => ({
  chart: { background: 'transparent' },
  colors: ['#6366f1'],
  plotOptions: {
    radialBar: {
      hollow: { size: '70%' },
      track: { background: '#e5e7eb' },
      dataLabels: {
        value: { fontSize: '24px', fontWeight: 700, offsetY: 5 },
        name: { show: false }
      }
    }
  },
  labels: ['Used']
}))

// --- 3. Bandwidth (Bar Chart) ---
const bandwidthSeries = ref([{
  name: 'Transfer (GB)',
  data: [120, 180, 150, 220, 280, 240, 310, 290, 260, 340, 380, 350]
}])

const bandwidthChartOptions = computed(() => ({
  chart: { toolbar: { show: false }, background: 'transparent' },
  colors: ['#8b5cf6'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  tooltip: { theme: 'dark' },
  dataLabels: { enabled: false }
}))

// --- Actions ---
const refreshData = async () => {
  refreshing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  // Randomize data slightly to simulate live update
  loadSeries.value[0].data = loadSeries.value[0].data.map(v => Math.min(100, Math.max(10, v + Math.floor(Math.random() * 20 - 10))))
  refreshing.value = false
}
</script>