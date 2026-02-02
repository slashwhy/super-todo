<script setup lang="ts">
import MainLayout from './components/layout/MainLayout.vue'
import ToastContainer from './components/common/ToastContainer.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
  <ToastContainer />
</template>

<style>
@import './assets/styles/base.css';
</style>
