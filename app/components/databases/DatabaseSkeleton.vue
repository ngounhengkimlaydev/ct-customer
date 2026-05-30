<template>
  <UCard :ui="{ body: 'space-y-4' }">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <USkeleton class="h-5 w-32 mb-2" />
        <USkeleton class="h-4 w-48" />
      </div>
      <USkeleton class="h-6 w-24 rounded-full" />
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <UCard v-for="i in count" :key="i">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex gap-3 flex-1">
            <!-- Icon placeholder -->
            <USkeleton class="size-11 rounded-xl shrink-0" />

            <div class="flex-1 space-y-2">
              <!-- Name + badge -->
              <div class="flex flex-wrap items-center gap-2">
                <USkeleton class="h-5 w-28" />
                <USkeleton class="h-5 w-16 rounded-full" />
              </div>

              <!-- Host -->
              <USkeleton class="h-4 w-40" />

              <!-- Badges row -->
              <div class="flex flex-wrap gap-2 mt-3">
                <USkeleton class="h-5 w-16 rounded-full" />
                <USkeleton class="h-5 w-20 rounded-full" />
                <USkeleton class="h-5 w-14 rounded-full" />
              </div>
            </div>
          </div>

          <!-- Actions button -->
          <USkeleton class="size-8 rounded-md shrink-0" />
        </div>

        <!-- Footer stats -->
        <div class="mt-4 grid grid-cols-3 gap-3 border-t border-default pt-4">
          <div v-for="j in 3" :key="j" class="space-y-2">
            <USkeleton class="h-3 w-12" />
            <USkeleton class="h-4 w-16" />
          </div>
        </div>
      </UCard>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 4
})
</script>