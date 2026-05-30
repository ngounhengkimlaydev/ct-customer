<template>
  <UCard class="h-full">
    <template #header>
      Hosted Websites
    </template>

    <div class="space-y-3">
      <div
        v-for="site in sites"
        :key="site.domain"
        class="flex items-center justify-between rounded-xl border p-4"
      >
        <div>
          <h3 class="font-medium">
            {{ site.domain }}
          </h3>

          <p class="text-sm text-muted">
            {{ site.type }}
          </p>
        </div>

        <div class="flex gap-2">
          <UBadge
            :color="site.ssl ? 'success' : 'warning'"
            variant="soft"
          >
            {{ site.ssl ? 'SSL' : 'No SSL' }}
          </UBadge>

          <UBadge
            color="success"
            variant="soft"
          >
            Online
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  sites: any[]
}>()
</script>