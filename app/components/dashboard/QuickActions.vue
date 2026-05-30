<template>
  <UCard>
    <template #header>
      Quick Actions
    </template>

    <div class="grid gap-3">
      <UButton
        block
        icon="i-lucide-globe"
        label="Create Website"
      />

      <UButton
        block
        color="neutral"
        variant="outline"
        icon="i-lucide-database"
        label="Create Database"
      />

      <UButton
        block
        color="neutral"
        variant="outline"
        icon="i-lucide-github"
        label="Deploy GitHub"
      />

      <UButton
        block
        color="neutral"
        variant="outline"
        icon="i-lucide-lock"
        label="Issue SSL"
      />
    </div>
  </UCard>
</template>