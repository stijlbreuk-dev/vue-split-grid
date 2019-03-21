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
          console.warn("Property 'value' should be of type Number");
          return false;
        }
        if (typeof unit !== 'string') {
          console.warn("Property 'unit' should be of type String");
          return false;
        }

        if (Object.keys(rest).length > 0) {
          console.warn(
            `Invalid size properties: '${Object.keys(rest).join(
              "', '"
            )}', allowed properties: '${ALLOWED_KEYS.join("', '")}'.`
          );
          return false;
        }
        return true;
      }
    },
  },
  watch: {
    show(value) {
      this.$parent.$emit('vsg:grid-area.show', value);
    },
    size(size) {
      this.$parent.$emit('vsg:grid-area.size', { size, uuid: this.uuid });
    }
  },
  mounted() {
    this.$parent.$emit('vsg:child.add', { type: 'grid-area', uuid: this.uuid, size: this.size });
  },
  destroyed() {
    this.$parent.$emit('vsg:child.remove', { uuid: this.uuid });
  },
};
</script>
<template>
  <div
    v-show="show"
    class="vsg_area">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
</style>
