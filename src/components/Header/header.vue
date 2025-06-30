<template>
  <header class="main-header">
    <div class="logo">bitnaza</div>
  </header>
</template>

<script setup lang="ts">
// Header component ไม่ต้องมี logic
</script>

<style scoped>
.main-header {
  width: 100vw;
  height: 64px;
  background: linear-gradient(90deg, #fffbe7 0%, #ffe0b2 100%);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.logo {
  font-size: 2.2rem;
  font-weight: bold;
  color: #f7931a;
  letter-spacing: 2px;
  margin-left: 32px;
  font-family: 'Segoe UI', 'Prompt', Arial, sans-serif;
  user-select: none;
}
</style>
