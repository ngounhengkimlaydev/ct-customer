<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
    <UCard v-for="stat in stats" :key="stat.label" :ui="{ body: 'flex items-center justify-between gap-4' }">
      <div>
        <p class="text-sm text-muted">{{ stat.label }}</p>
        <p class="mt-1 text-2xl font-bold text-highlighted">{{ stat.value }}</p>
      </div>

      <div class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <UIcon :name="stat.icon" class="size-5" />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { DatabaseItem } from '~/types/database'

const props = defineProps<{
  items: DatabaseItem[]
}>()

const stats = computed(() => [
  {
    label: 'Total Databases',
    value: props.items.length,
    icon: 'i-lucide-database'
  },
  {
    label: 'Active',
    value: props.items.filter((item) => item.status === 1).length,
    icon: 'i-lucide-check-circle'
  },
  {
    label: 'Suspended',
    value: props.items.filter((item) => item.status === 2).length,
    icon: 'i-lucide-pause-circle'
  },
{
  label: 'Total Size',
  value: `0 MB`,
  icon: 'i-lucide-hard-drive'
}
])
</script>