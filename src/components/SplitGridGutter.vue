<template>
  <div
    v-show="show"
    class="vsg_gutter"
    :class="{ 'vsg_gutter-horizontal': gridData.direction === 'horizontal', 'vsg_gutter-vertical': gridData.direction === 'vertical' }"
    :style="{ cursor: gridData.cursor }"
  />
</template>
<script>
import UuidMixin from '../mixins/uuid.js';

export default {
  name: 'SplitGridGutter',
  mixins: [UuidMixin],
  props: {
    show: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default() {
        return this.gridData.gutterSize;
      }
    }
  },
  inject: ['gridData'],
  watch: {
    show(value) {
      this.$parent.$emit('vsg:gutter.show', value);
    }
  },
  mounted() {
    this.$parent.$emit('vsg:child.add', {
      type: 'gutter',
      uuid: this.uuid,
      size: {
        value: this.size,
        unit: 'px'
      }
    });
  },
  destroyed() {
    this.$parent.$emit('vsg:child.remove', { uuid: this.uuid });
  }
};
</script>
<style lang="scss" scoped>
.vsg_gutter {
  background-color: gray;

  &.vsg_gutter-horizontal {
  }

  &.vsg_gutter-vertical {
  }
}
</style>
