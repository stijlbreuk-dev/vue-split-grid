<script>
export default {
  name: 'SplitGridGutter',
  props: {
    track: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      required: true,
      validator: val => ['horizontal', 'vertical'].includes(val)
    }
  }
};
</script>
<template>
  <div
    class="vsg_gutter"
    :class="{ 'gutter-horizontal': direction === 'horizontal', 'gutter-vertical': direction === 'vertical' }" />
</template>
<style lang="scss" scoped>
.vsg_gutter {
  background-color: gray;

  &.gutter-horizontal {
  }

  &.gutter-vertical {
  }
}
</style>
