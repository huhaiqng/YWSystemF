<template>
  <div class="app-container">
    <span>{{ env }}</span>
    <span>{{ project }}</span>
    <span>{{ software }}</span>
  </div>
</template>
<script>
export default {
  props: {
    env: { type: String, default: null },
    project: { type: String, default: null },
    software: { type: String, default: null }
  }
}
</script>
