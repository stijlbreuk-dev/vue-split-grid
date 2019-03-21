<template>
  <div class="vsg_split-grid">
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
          console.warn("Property 'duration' should be of type Number");
          return false;
        }
        if (typeof easing !== 'string') {
          console.warn("Property 'easing' should be of type String");
          return false;
        }

        if (Object.keys(rest).length > 0) {
          console.warn(
            `Invalid animation properties: '${Object.keys(rest).join(
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
    /**
     * Split Grid properties
     */
    minSize: {
      type: Number,
      default: 0
    },
    columnMinSize: {
      type: Number,
      default: function() {
        return this.minSize;
      }
    },
    rowMinSize: {
      type: Number,
      default: function() {
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
      default: function() {
        return this.snapOffset;
      }
    },
    rowSnapOffset: {
      type: Number,
      default: function() {
        return this.snapOffset;
      }
    },
    dragInterval: {
      type: Number,
      default: 1
    },
    columnDragInterval: {
      type: Number,
      default: function() {
        return this.dragInterval;
      }
    },
    rowDragInterval: {
      type: Number,
      default: function() {
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
  provide: function() {
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
  data() {
    return {
      animationInterval: null,
      splitGrid: null,
      previousChildComponentSizes: {}
    };
  },
  computed: {},
  mounted() {
    this.validateChildComponents();
    this.initializeSplitGrid();
    this.$on('vsg:gutter.show', this.onShowGutter);
    this.$on('vsg:grid-area.show', this.onShowGridArea);
    this.$on('vsg:grid-area.size', this.onGridAreaSizeChange);

    this.$on('vsg:child.add', this.onChildAdded);
    this.$on('vsg:child.remove', this.onChildRemoved);
  },
  beforeDestroy() {
    this.splitGrid.destroy(true);
  },
  methods: {
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
          const { unit, value } = this.previousChildComponentSizes[uuid];
          return `${value}${unit}`;
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

      this.splitGrid = SplitGrid({
        ...this.$props,
        columnGutters,
        rowGutters,
        onDrag: this.onDrag,
        onDragStart: this.onDragStart,
        onDragEnd: this.onDragEnd,
        gridTemplateColumns: this.direction === 'column' ? styleString : '',
        gridTemplateRows: this.direction === 'row' ? styleString : ''
      });

      this.$el.style[
        this.direction === 'column'
          ? 'grid-template-columns'
          : 'grid-template-rows'
      ] = styleString;
    },
    updateGridCSS() {
      this.$nextTick(() => {
        const visibleChildComponentStyles = this.getVisibleChildComponentStyles();
        const styleString = visibleChildComponentStyles.join(' ');
        this.$el.style[
          this.direction === 'column'
            ? 'grid-template-columns'
            : 'grid-template-rows'
        ] = styleString;
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
            console.log({ element });
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
          const splitValueAndUnitRegex = /(\d?\.?\d+)(\w*)/;
          const [ value, unit ] = gridTemplateStyleParts[index]
            .split(splitValueAndUnitRegex)
            .filter(part => part !== '');
          this.previousChildComponentSizes[uuid] = {
            value,
            unit
          }
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
    onShowGutter() {
      this.updateGutters();
      this.updateGridCSS();
    },
    onShowGridArea() {
      this.updateGutters();
      this.updateGridCSS();
    },
    onChildAdded({ type, uuid, size }) {
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

    onGridAreaSizeChange({ value, uuid }) {
      console.log('size change');
      const gridTemplateStyle = this.$el.style['grid-template-rows'];

      const gridTemplateStyleParts = gridTemplateStyle.split(' ');

      if (this.animation == null) {
        gridTemplateStyleParts[2] = `${value}px`;
        const newGridTemplateStyle = gridTemplateStyleParts.join(' ');
        this.$el.style['grid-template-rows'] = newGridTemplateStyle;
        return;
      }

      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }

      const FPS = 60;
      const lastTick = (this.animation.duration / 1000) * FPS;
      const easingFunction = EasingFunctions[this.animation.easing];

      const diff = 200;

      let tick = 1;

      this.animationInterval = setInterval(() => {
        if (tick === lastTick) {
          clearInterval(this.animationInterval);
        }
        const newValue = diff * easingFunction(tick / lastTick);
        gridTemplateStyleParts[2] = `${100 + newValue}px`;
        const newGridTemplateStyle = gridTemplateStyleParts.join(' ');
        this.$el.style['grid-template-rows'] = newGridTemplateStyle;
        tick++;
      }, 1000 / 60);
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
