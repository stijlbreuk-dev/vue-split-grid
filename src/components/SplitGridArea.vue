<template>
  <transition
    v-if="transition != null"
    v-bind="transition"
    @after-leave="$parent.$emit('leave-transition-end')"
  >
    <template v-if="render != null">
      <div
        v-if="render"
        :key="`vsg_area_v-if_${uuid}`"
        class="vsg_area"
      >
        <slot />
      </div>
    </template>
    <div
      v-else
      v-show="show"
      :key="`vsg_area_v-show_${uuid}`"
      class="vsg_area"
    >
      <slot />
    </div>
  </transition>
  <div
    v-else-if="render != null && render"
    :key="`vsg_area_v-if_${uuid}`"
    class="vsg_area"
  >
    <slot />
  </div>
  <div
    v-else-if="render == null"
    v-show="show"
    :key="`vsg_area_v-show_${uuid}`"
    class="vsg_area"
  >
    <slot />
  </div>
</template>
<script>
import UuidMixin from '../mixins/uuid.js';

export default {
  name: 'SplitGridArea',
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
    sizeUnit: {
      type: String,
      default: 'fr'
    },
    sizeValue: {
      type: Number,
      default: 1
    },
    transition: {
      type: Object,
      default: null,
      validator: (val) => Object.keys(val).indexOf('name') > -1
    }
  },
  watch: {
    render(value) {
      if (value) {
        this.$parent.$emit('vsg:child.add', {
          type: 'grid-area',
          uuid: this.uuid,
          size: {
            unit: this.sizeUnit,
            value: this.sizeValue
          }
        });
      } else {
        this.$parent.$emit('vsg:child.remove', { type: 'grid-area', uuid: this.uuid, waitForTransition: this.transition != null });
      }
    },
    show(value) {
      this.$parent.$emit('vsg:child.show', { type: 'grid-area', uuid: this.uuid, value, waitForTransition: this.transition != null });
    },
    sizeUnit(unit) {
      this.$parent.$emit('vsg:child.resize', { size: { unit, value: this.sizeValue }, type: 'grid-area', uuid: this.uuid });
    },
    sizeValue(value) {
      this.$parent.$emit('vsg:child.resize', { size: { unit: this.sizeUnit, value }, type: 'grid-area', uuid: this.uuid });
    }
  },
  mounted() {
    this.$parent.$emit('vsg:child.add', {
      type: 'grid-area',
      uuid: this.uuid,
      size: {
        unit: this.sizeUnit,
        value: this.sizeValue
      }
    });
  }
};
</script>
<style lang="scss" scoped>
</style>
