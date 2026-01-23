<script lang="ts" setup>

</script>

<template>
  <UDashboardGroup class="fixed inset-0 flex overflow-hidden">
    <UDashboardPanel class="bg-gray-50">
      <template #header>
        <UDashboardNavbar title="cawe.dev - Admin Dashboard" icon="i-lucide-house"
          :toggle="{ disabled: true, class: 'hidden' }" />
      </template>

      <template #body>
        <div class="p-6">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>


<style></style>