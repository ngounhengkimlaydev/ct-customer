<template>
  <UCard>
    <template #header>
      Security Overview
    </template>

    <div class="space-y-4">
      <div class="flex justify-between">
        <span>Firewall</span>
        <UBadge color="success">
          Protected
        </UBadge>
      </div>

      <div class="flex justify-between">
        <span>SSL Coverage</span>
        <UBadge color="success">
          Active
        </UBadge>
      </div>

      <div class="flex justify-between">
        <span>Backups</span>
        <UBadge color="success">
          Enabled
        </UBadge>
      </div>

      <div class="flex justify-between">
        <span>DDoS Protection</span>
        <UBadge color="success">
          Enabled
        </UBadge>
      </div>
    </div>
  </UCard>
</template>