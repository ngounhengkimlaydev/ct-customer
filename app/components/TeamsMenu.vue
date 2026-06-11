<script setup lang="ts">

defineProps<{
  collapsed?: boolean
}>()


</script>

<template>
  <img class="hidden dark:block cursor-pointer max-w-20 lg:w-full" src="/logo.png" @click="navigateTo('/')" />
  <img class="dark:hidden block cursor-pointer max-w-20 lg:w-full" src="/logo.png" @click="navigateTo('/')" />
</template>
