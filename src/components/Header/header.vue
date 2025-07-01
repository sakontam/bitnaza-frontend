<script setup lang="ts">
const openLoginDialog = () => {
  console.log("ยังไม่มี dialog แต่คลิกได้แล้วนะ");
  // TODO: แสดง dialog login ที่จะทำในอนาคต
};
</script>

<template>
  <header class="main-header">
    <div class="logo">bitnaza</div>
    <div class="login" @click="openLoginDialog">Login</div>
  </header>
</template>

<style scoped>
.main-header {
  width: 100vw;
  height: 64px;
  background: linear-gradient(90deg, #fffbe7 0%, #ffe0b2 100%);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.logo {
  font-size: 50px;
  font-weight: bold;
  color: #f7931a;
  letter-spacing: 2px;
  margin-left: 32px;
  font-family: "Plus Jakarta Sans";
  user-select: none;
}

.login {
  font-size: 20px;
  font-weight: normal;
  font-family: "Inter";
  margin-left: auto;
  margin-right: 32px;
  cursor: pointer;
}
</style>
