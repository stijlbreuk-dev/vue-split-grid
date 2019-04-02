<template>
  <SplitGridArea
    size-unit="px"
    :size-value="250"
    :show="showColumn3"
    :transition="transition"
  >
    A split grid area with a lot of child components.
  </SplitGridArea>
</template>
<script>
export default {
  props: {
    showColumn3: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      transition: {
        name: 'slide-to-left'
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
