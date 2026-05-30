<template>
  <UCard>
    <template #header>
      Recent Activity
    </template>

    <UTimeline
      :items="[
        {
          title: 'Website deployed',
          description: 'api.ct-cloud.com'
        },
        {
          title: 'SSL renewed',
          description: 'example.com'
        },
        {
          title: 'Database created',
          description: 'production_db'
        }
      ]"
    />
  </UCard>
</template>