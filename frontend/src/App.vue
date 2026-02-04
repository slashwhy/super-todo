<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from './components/layout/MainLayout.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import FloatingActionButton from './components/common/FloatingActionButton.vue'
import TaskCreateModal from './components/tasks/TaskCreateModal.vue'

const isCreateModalOpen = ref(false)

function openCreateModal() {
  isCreateModalOpen.value = true
}
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
  <ToastContainer />
  <FloatingActionButton @click="openCreateModal" />
  <TaskCreateModal v-model="isCreateModalOpen" />
</template>

<style>
@import './assets/styles/base.css';
</style>
