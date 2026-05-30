<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-semibold">
            Resource Usage
          </h2>

          <p class="text-sm text-muted">
            Real-time monitoring
          </p>
        </div>

        <UBadge
          color="success"
          variant="soft"
        >
          Live
        </UBadge>
      </div>
    </template>

    <ApexChart
      height="350"
      type="area"
      :options="options"
      :series="series"
    />
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: any
}>()

const series = computed(() => [
  {
    name: 'CPU',
    data: [props.stats?.cpu ?? 0]
  },
  {
    name: 'RAM',
    data: [props.stats?.ram ?? 0]
  }
])

const options = {
  chart: {
    toolbar: {
      show: false
    }
  },

  stroke: {
    curve: 'smooth'
  },

  dataLabels: {
    enabled: false
  },

  fill: {
    type: 'gradient'
  }
}
</script>