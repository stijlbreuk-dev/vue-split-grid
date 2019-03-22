<template>
  <transition
    v-if="transition != null"
    v-bind="transition"
    @after-leave="$parent.$emit('leave-transition-end')"
  >
    <div
      v-show="show"
      class="vsg_area"
    >
      <slot />
    </div>
  </transition>
  <div
    v-else
    v-show="show"
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
    show: {
      type: Boolean,
      default: true
    },
    size: {
      type: Object,
      default: () => ({ unit: 'fr', value: 1 }),
      validator(size) {
        const { unit, value, ...rest } = size;
        const ALLOWED_KEYS = ['duration', 'easing'];

        if (typeof value !== 'number') {
          console.warn("[Vue Split Grid]: Property 'value' should be of type Number");
          return false;
        }
        if (typeof unit !== 'string') {
          console.warn("[Vue Split Grid]: Property 'unit' should be of type String");
          return false;
        }

        if (Object.keys(rest).length > 0) {
          console.warn(
            `[Vue Split Grid]: Invalid size properties: '${Object.keys(rest).join(
              "', '"
            )}', allowed properties: '${ALLOWED_KEYS.join("', '")}'.`
          );
          return false;
        }
        return true;
      }
    },
    transition: {
      type: Object,
      default: null,
      validator: (val) => Object.keys(val).indexOf('name') > -1
    }
  },
  watch: {
    show(value) {
      this.$parent.$emit('vsg:child.show', { type: 'grid-area', uuid: this.uuid, value, waitForTransition: this.transition != null });
    },
    size(size) {
      this.$parent.$emit('vsg:child.resize', { size, type: 'grid-area', uuid: this.uuid });
    }
  },
  mounted() {
    this.$parent.$emit('vsg:child.add', {
      type: 'grid-area',
      uuid: this.uuid,
      size: this.size
    });
  },
  destroyed() {
    this.$parent.$emit('vsg:child.remove', { type: 'gutter', uuid: this.uuid, waitForTransition: this.transition != null });
  }
};
</script>
<style lang="scss" scoped>
</style>
