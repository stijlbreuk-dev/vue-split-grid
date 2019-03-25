<template>
  <transition
    v-if="transition != null"
    v-bind="transition"
    @after-leave="$parent.$emit('leave-transition-end', 'leave-end')"
  >
    <template v-if="render != null">
      <div
        v-if="render"
        :key="`vsg_area_v-if_${uuid}`"
        class="vsg_gutter"
        :class="{ 'vsg_gutter-horizontal': gridData.direction === 'horizontal', 'vsg_gutter-vertical': gridData.direction === 'vertical' }"
        :style="{ cursor: gridData.cursor }"
      />
    </template>
    <div
      v-else
      v-show="show"
      :key="`vsg_area_v-show_${uuid}`"
      class="vsg_gutter"
      :class="{ 'vsg_gutter-horizontal': gridData.direction === 'horizontal', 'vsg_gutter-vertical': gridData.direction === 'vertical' }"
      :style="{ cursor: gridData.cursor }"
    />
  </transition>
  <div
    v-else-if="render != null && render"
    :key="`vsg_area_v-if_${uuid}`"
    class="vsg_gutter"
    :class="{ 'vsg_gutter-horizontal': gridData.direction === 'horizontal', 'vsg_gutter-vertical': gridData.direction === 'vertical' }"
    :style="{ cursor: gridData.cursor }"
  />
  <div
    v-else-if="render == null"
    v-show="show"
    :key="`vsg_area_v-show_${uuid}`"
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
    render: {
      type: Boolean,
      default: null
    },
    show: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default() {
        return this.gridData.gutterSize;
      }
    },
    transition: {
      type: Object,
      default: null,
      validator: (val) => Object.keys(val).indexOf('name') > -1
    }
  },
  inject: ['gridData'],
  watch: {
    render(value) {
      if (value) {
        this.$parent.$emit('vsg:child.add', {
          type: 'gutter',
          uuid: this.uuid,
          size: {
            value: this.size,
            unit: 'px'
          }
        });
      } else {
        this.$parent.$emit('vsg:child.remove', { type: 'gutter', uuid: this.uuid, waitForTransition: this.transition != null });
      }
    },
    show(value) {
      this.$parent.$emit('vsg:child.show', { type: 'gutter', uuid: this.uuid, value, waitForTransition: this.transition != null });
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
