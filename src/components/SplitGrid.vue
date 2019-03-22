<template>
  <transition
    v-if="transition != null"
    v-bind="transition"
    @after-leave="$parent.$emit('leave-transition-end')"
  >
    <div
      v-show="show"
      class="vsg_split-grid"
    >
      <slot />
    </div>
  </transition>
  <div
    v-else
    v-show="show"
    class="vsg_split-grid"
  >
    <slot />
  </div>
</template>
<script>
import SplitGrid from 'split-grid';

import UuidMixin from '../mixins/uuid.js';

import * as EasingFunctions from '../utils/easing.js';

const VALID_CHILD_COMPONENTS = [
  'SplitGrid',
  'SplitGridArea',
  'SplitGridGutter'
];
const VALID_CHILD_COMPONENTS_REGEX = new RegExp(
  `(${VALID_CHILD_COMPONENTS.join('|')})$`
);

export default {
  name: 'SplitGrid',
  mixins: [UuidMixin],
  props: {
    /**
     * Custom properties
     */
    animation: {
      type: Object,
      default: null,
      validator: animation => {
        const { duration, easing, ...rest } = animation;
        const ALLOWED_KEYS = ['duration', 'easing'];

        if (typeof duration !== 'number') {
          console.warn("[Vue Split Grid]: Property 'duration' should be of type Number");
          return false;
        }
        if (typeof easing !== 'string') {
          console.warn("[Vue Split Grid]: Property 'easing' should be of type String");
          return false;
        }

        if (Object.keys(rest).length > 0) {
          console.warn(
            `[Vue Split Grid]: Invalid animation properties: '${Object.keys(rest).join(
              "', '"
            )}', allowed properties: '${ALLOWED_KEYS.join("', '")}'.`
          );
          return false;
        }
        return true;
      }
    },
    direction: {
      type: String,
      default: 'column',
      validator: val => ['column', 'row'].includes(val)
    },
    gutterSize: {
      type: Number,
      default: 5
    },
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
    },
    /**
     * Split Grid properties
     */
    minSize: {
      type: Number,
      default: 0
    },
    columnMinSize: {
      type: Number,
      default: function () {
        return this.minSize;
      }
    },
    rowMinSize: {
      type: Number,
      default: function () {
        return this.minSize;
      }
    },
    columnMinSizes: {
      type: Object,
      default: () => ({})
    },
    rowMinSizes: {
      type: Object,
      default: () => ({})
    },
    snapOffset: {
      type: Number,
      default: 30
    },
    columnSnapOffset: {
      type: Number,
      default: function () {
        return this.snapOffset;
      }
    },
    rowSnapOffset: {
      type: Number,
      default: function () {
        return this.snapOffset;
      }
    },
    dragInterval: {
      type: Number,
      default: 1
    },
    columnDragInterval: {
      type: Number,
      default: function () {
        return this.dragInterval;
      }
    },
    rowDragInterval: {
      type: Number,
      default: function () {
        return this.dragInterval;
      }
    },
    cursor: {
      type: String,
      default: null
    },
    columnCursor: {
      type: String,
      default: 'col-resize'
    },
    rowCursor: {
      type: String,
      default: 'row-resize'
    },
    writeStyle: {
      type: Function,
      default: (grid, gridTemplateProp, gridTemplateStyle) => {
        grid.style[gridTemplateProp] = gridTemplateStyle;
      }
    }
  },
  data() {
    return {
      animationInterval: null,
      gridTemplateProp:
        this.direction === 'column'
          ? 'grid-template-columns'
          : 'grid-template-rows',
      /**
       * Determine if a grid is a subgrid by checking the parents vNode tag for now, provide / inject
       * could be used but then we would need the default inject value functionality which is only
       * supported by >= Vue 2.5
       */
      isSubGrid: this.$parent.$vnode.tag.endsWith('SplitGrid'),
      previousChildComponentSizes: {},
      splitGrid: null
    };
  },
  watch: {
    show(value) {
      if (this.isSubGrid) {
        this.$parent.$emit('vsg:child.show', {
          type: 'grid',
          value,
          uuid: this.uuid,
          waitForTransition: this.transition != null
        });
      }
    },
    size(size) {
      if (this.isSubGrid) {
        this.$parent.$emit('vsg:child.resize', {
          size,
          type: 'grid',
          uuid: this.uuid
        });
      }
    }
  },
  provide: function () {
    const cursor = (() => {
      if (this.direction === 'column') {
        return this.columnCursor || this.cursor;
      }
      return this.rowCursor || this.cursor;
    })();
    return {
      gridData: {
        direction: this.direction,
        gutterSize: this.gutterSize,
        cursor
      }
    };
  },
  mounted() {
    this.validateChildComponents();
    this.initializeSplitGrid();

    this.$on('vsg:child.add', this.onChildAdded);
    this.$on('vsg:child.remove', this.onChildRemoved);
    this.$on('vsg:child.resize', this.onChildResize);
    this.$on('vsg:child.show', this.onChildShow);

    if (this.isSubGrid) {
      this.$parent.$emit('vsg:child.add', {
        type: 'grid',
        uuid: this.uuid,
        size: this.size
      });
    }
  },
  beforeDestroy() {
    this.splitGrid.destroy(true);

    if (this.isSubGrid) {
      this.$parent.$emit('vsg:child.remove', { type: 'grid', uuid: this.uuid });
    }
  },
  methods: {
    animateSizeChange({
      elementIndex,
      gridTemplateStyleParts,
      newSize: { value: newValue, unit: newUnit }
    }) {
      const FPS = 60;
      const totalTicks = (this.animation.duration / 1000) * FPS;
      const easingFunction = EasingFunctions[this.animation.easing];

      const getStyleValueAndUnit = (styleString) => {
        const splitValueAndUnitRegex = /(\d+\.\d+|\d+)(\w*)/;
        return styleString
          .split(splitValueAndUnitRegex)
          // Fix empty matches: https://stackoverflow.com/a/19918223
          .filter(part => part !== '');
      }

      const [currentStringValue, currentUnit] = getStyleValueAndUnit(gridTemplateStyleParts[elementIndex]);

      if (currentUnit !== newUnit) {
        console.warn(`[Vue Split Grid]: Can't animate from ${currentUnit} to ${newUnit}.`);
        return;
      }

      const currentValue = (() => {
        if (currentUnit === 'fr') {
          const camelCasedGridTemplateProp = this.gridTemplateProp.endsWith('columns') ? 'gridTemplateColumns' : 'gridTemplateRows';
          const computedTemplatePropStyle = getComputedStyle(this.$el)[camelCasedGridTemplateProp];
          const elementPropStyle = computedTemplatePropStyle.split(' ')[elementIndex];

          const [computedStringValue] = getStyleValueAndUnit(elementPropStyle);
          return parseFloat(computedStringValue);
        }
        return parseFloat(currentStringValue)
      })();

      const difference = newValue - currentValue;
      let tick = 1;

      this.animationInterval = setInterval(() => {
        if (tick === totalTicks) {
          clearInterval(this.animationInterval);
        }
        const intermediateValue =
          difference * easingFunction(tick / totalTicks);
        gridTemplateStyleParts[elementIndex] = `${currentValue +
          intermediateValue}${newUnit}`;
        const newGridTemplateStyle = gridTemplateStyleParts.join(' ');
        this.$el.style[this.gridTemplateProp] = newGridTemplateStyle;
        tick++;
      }, 1000 / FPS);
    },
    getGutters() {
      const gutters = [];
      this.getVisibleChildComponents().forEach((childVNode, index) => {
        if (childVNode.tag.endsWith('SplitGridGutter')) {
          gutters.push({
            element: childVNode.elm,
            track: index
          });
        }
      });
      return gutters;
    },
    getVisibleChildComponents() {
      const { default: childComponents } = this.$slots;
      return (
        childComponents
          // Filter components that have been hidden by using v-if
          .filter(childVNode => {
            return childVNode && childVNode.tag;
          })
          // Filter components that have been hidden by using :show
          .filter(childVNode => {
            return childVNode.componentInstance.show;
          })
      );
    },
    getVisibleChildComponentStyles() {
      return this.getVisibleChildComponents().map(
        ({ componentInstance: { uuid } }) => {
          const size = this.previousChildComponentSizes[uuid];
          // When a sub grid has been removed it's size may have been removed already.
          if (size) {
            const { unit, value } = size;
            return `${value}${unit}`;
          }
          return;
        }
      );
    },
    initializeSplitGrid() {
      const columnGutters = [];
      const rowGutters = [];

      const gutters = this.getGutters();

      if (this.direction === 'column') {
        columnGutters.push(...gutters);
      } else {
        rowGutters.push(...gutters);
      }

      this.$slots.default.forEach(vNode => {
        if (vNode.componentInstance) {
          const {
            componentInstance: { size, uuid }
          } = vNode;
          if (vNode.tag.endsWith('SplitGridGutter')) {
            this.previousChildComponentSizes = {
              ...this.previousChildComponentSizes,
              [uuid]: {
                unit: 'px',
                value: size
              }
            };
          } else {
            this.previousChildComponentSizes = {
              ...this.previousChildComponentSizes,
              [uuid]: size
            };
          }
        }
      });

      const visibleChildComponentStyles = this.getVisibleChildComponentStyles();
      const styleString = visibleChildComponentStyles.join(' ');

      // eslint-disable-next-line
      const { animation, direction, gutterSize, show, size, ...splitGridProperties } = this.$props;

      this.splitGrid = SplitGrid({
        ...splitGridProperties,
        columnGutters,
        rowGutters,
        onDrag: this.onDrag,
        onDragStart: this.onDragStart,
        onDragEnd: this.onDragEnd,
        gridTemplateColumns: this.direction === 'column' ? styleString : '',
        gridTemplateRows: this.direction === 'row' ? styleString : ''
      });

      this.$el.style[this.gridTemplateProp] = styleString;
    },
    updateGridCSS() {
      this.$nextTick(() => {
        const visibleChildComponentStyles = this.getVisibleChildComponentStyles();
        const styleString = visibleChildComponentStyles.join(' ');
        this.$el.style[this.gridTemplateProp] = styleString;
      });
    },
    updateGutters() {
      this.$nextTick(() => {
        const newGutters = this.getGutters();

        const existingColumnGutters = Object.values(
          this.splitGrid.columnGutters
        );
        const existingRowGutters = Object.values(this.splitGrid.rowGutters);

        existingColumnGutters.forEach(({ track }) => {
          this.splitGrid.removeColumnGutter(track, true);
        });
        existingRowGutters.forEach(({ track }) => {
          this.splitGrid.removeRowGutter(track, true);
        });

        if (this.direction === 'column') {
          newGutters.forEach(({ element, track }) => {
            this.splitGrid.addColumnGutter(element, track);
          });
        } else {
          newGutters.forEach(({ element, track }) => {
            this.splitGrid.addRowGutter(element, track);
          });
        }
      });
    },
    validateChildComponents() {
      const { default: childComponents } = this.$slots;
      const hasValidChildComponents = childComponents.every(
        ({ componentInstance, tag }) =>
          // vNode instances with an undefined componentInstance might be hidden using 'v-if', assume it is a valid tag.
          typeof componentInstance === 'undefined' ||
          VALID_CHILD_COMPONENTS_REGEX.test(tag)
      );
      if (!hasValidChildComponents) {
        throw new Error(
          `Invalid child components. SplitGrid only allows ${VALID_CHILD_COMPONENTS.join(
            ', '
          )} as children.`
        );
      }
    },
    /**
     * Split Grid events
     */
    onDrag(direction, track, gridTemplateStyle) {
      const gridTemplateStyleParts = gridTemplateStyle.split(' ');
      const visibleChildComponents = this.getVisibleChildComponents();
      visibleChildComponents.forEach(
        ({ componentInstance: { uuid } }, index) => {
          const splitValueAndUnitRegex = /(\d+\.\d+|\d+)(\w*)/;
          const [value, unit] = gridTemplateStyleParts[index]
            .split(splitValueAndUnitRegex)
            // Fix empty matches: https://stackoverflow.com/a/19918223
            .filter(part => part !== '');
          this.previousChildComponentSizes[uuid] = {
            value,
            unit
          };
        }
      );
      this.$emit('drag', {
        direction,
        gridTemplateStyle,
        track
      });
    },
    onDragStart(direction, track) {
      this.$emit('drag-start', {
        direction,
        track
      });
    },
    onDragEnd(direction, track) {
      this.$emit('drag-end', {
        direction,
        track
      });
    },
    /**
     * Child events
     */
    onChildAdded({ uuid, size }) {
      this.validateChildComponents();

      this.previousChildComponentSizes = {
        ...this.previousChildComponentSizes,
        [uuid]: size
      };

      this.updateGutters();
      this.updateGridCSS();
    },
    onChildRemoved({ uuid }) {
      const newChildComponentSizes = { ...this.previousChildComponentSizes };
      delete newChildComponentSizes[uuid];
      this.previousChildComponentSizes = newChildComponentSizes;

      this.updateGutters();
      this.updateGridCSS();
    },
    onChildResize({ size: { value, unit }, uuid }) {
      const elementIndex = this.getVisibleChildComponents().findIndex(
        ({ componentInstance: { uuid: componentUuid } }) =>
          componentUuid === uuid
      );

      if (elementIndex === -1) {
        return;
      }

      const gridTemplateStyle = this.$el.style[this.gridTemplateProp];
      const gridTemplateStyleParts = gridTemplateStyle.split(' ');

      this.previousChildComponentSizes = {
        ...this.previousChildComponentSizes,
        [uuid]: {
          value,
          unit
        }
      };

      if (this.animation == null) {
        gridTemplateStyleParts[elementIndex] = `${value}${unit}`;
        const newGridTemplateStyle = gridTemplateStyleParts.join(' ');
        this.$el.style[this.gridTemplateProp] = newGridTemplateStyle;
        return;
      }

      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }
      this.animateSizeChange({
        elementIndex,
        gridTemplateStyleParts,
        newSize: { value, unit }
      });
    },
    onChildShow({ type, value, waitForTransition }) {
      if (waitForTransition && !value) {
        this.$once('leave-transition-end', () => {
          this.updateGutters();
          this.updateGridCSS();
        });
      } else {
        this.updateGutters();
        this.updateGridCSS();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.vsg_split-grid {
  display: grid;
  box-sizing: border-box;
}
</style>
