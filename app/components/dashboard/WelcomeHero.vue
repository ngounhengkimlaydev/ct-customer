<template>
    <UCard class="overflow-hidden border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 class="text-3xl font-bold">
                    Welcome Back {{ userStore.user?.full_name || 'User' }} 
                </h1>

                <p class="mt-2 text-muted">
                    Manage your websites, databases and deployments.
                </p>
            </div>

            <div class="flex gap-3">
                <UButton icon="i-lucide-plus" label="Create Website" />

                <UButton icon="i-lucide-github" color="neutral" variant="outline" label="Import Git" />
            </div>
        </div>
    </UCard>
</template>
<script setup lang="ts">
const userStore = useUserStore()
</script>