<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <UCard
      v-for="item in cards"
      :key="item.label"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted">
            {{ item.label }}
          </p>

          <h3 class="mt-2 text-3xl font-bold">
            {{ item.value }}
          </h3>
        </div>

        <div class="rounded-xl bg-primary/10 p-3">
          <UIcon
            :name="item.icon"
            class="size-6 text-primary"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: any
  sites: any[]
}>()

const cards = computed(() => [
  {
    label: 'Websites',
    value: props.sites.length,
    icon: 'i-lucide-globe'
  },
  {
    label: 'Storage',
    value: `${props.stats?.diskUsed ?? 0}GB`,
    icon: 'i-lucide-hard-drive'
  },
  {
    label: 'Bandwidth',
    value: `${props.stats?.bandwidth?.total ?? 0}GB`,
    icon: 'i-lucide-activity'
  },
  {
    label: 'SSL Active',
    value: props.sites.filter(x => x.ssl).length,
    icon: 'i-lucide-lock'
  }
])
</script>