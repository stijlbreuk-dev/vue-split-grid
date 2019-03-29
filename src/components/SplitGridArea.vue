<template>
  <transition
    v-if="transition != null"
    v-bind="transition"
    @after-leave="emitInParentGrid('leave-transition-end')"
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
    class="vsg_area"
  >
    <slot />
  </div>
  <div
    v-else-if="render == null"
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
      validator: val => Object.keys(val).indexOf('name') > -1
    }
  },
  watch: {
    render(value) {
      if (value) {
        this.emitInParentGrid('vsg:child.add', {
          type: 'grid-area',
          uuid: this.uuid,
          size: {
            unit: this.sizeUnit,
            value: this.sizeValue
          }
        });
      } else {
        this.emitInParentGrid('vsg:child.remove', {
          type: 'grid-area',
          uuid: this.uuid,
          waitForTransition: this.transition != null
        });
      }
    },
    show(value) {
      this.emitInParentGrid('vsg:child.show', {
        type: 'grid-area',
        uuid: this.uuid,
        value,
        waitForTransition: this.transition != null
      });
    },
    sizeUnit(unit) {
      this.emitInParentGrid('vsg:child.resize', {
        size: { unit, value: this.sizeValue },
        type: 'grid-area',
        uuid: this.uuid
      });
    },
    sizeValue(value) {
      this.emitInParentGrid('vsg:child.resize', {
        size: { unit: this.sizeUnit, value },
        type: 'grid-area',
        uuid: this.uuid
      });
    }
  },
  mounted() {
    this.emitInParentGrid('vsg:child.add', {
      type: 'grid-area',
      uuid: this.uuid,
      size: {
        unit: this.sizeUnit,
        value: this.sizeValue
      }
    });
  },
  methods: {
    emitInParentGrid(event, data) {
      const $parent = (() => {
        if (this.$parent.$vnode.tag.endsWith('SplitGrid')) {
          return this.$parent;
        } else if (this.$parent.$parent.$vnode.tag.endsWith('SplitGrid')) {
          return this.$parent.$parent;
        } else {
          throw new Error(
            `[Vue Split Grid]: Either the parent or grandparent of a 'SplitGridArea' component should be a 'SplitGridComponent'.`
          );
        }
      })();
      $parent.$emit(event, data);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
