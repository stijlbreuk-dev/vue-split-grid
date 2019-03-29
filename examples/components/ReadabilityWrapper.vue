<template>
  <SplitGridArea
    size-unit="px"
    :size-value="250"
    :show="showColumn3"
    :transition="transition"
  >
    column 3
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
