<script>
import SplitGrid from 'split-grid';

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
  props: {
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
    }
  },
  data() {
    return {
      instance: null
    };
  },
  mounted() {
    const { default: childComponents } = this.$slots;
    const validChildComponents = childComponents.every(({ tag }) =>
      VALID_CHILD_COMPONENTS_REGEX.test(tag)
    );
    if (!validChildComponents) {
      throw new Error(
        `Invalid child components. SplitGrid only allows ${VALID_CHILD_COMPONENTS.join(
          ', '
        )} as children.`
      );
    }

    const columns = [];
    const rows = [];

    childComponents
      .filter(({ tag }) => tag.endsWith('SplitGridGutter'))
      .forEach(childVNode => {
        if (childVNode.componentInstance.$props.direction === 'vertical') {
          columns.push(childVNode);
        } else if (
          childVNode.componentInstance.$props.direction === 'horizontal'
        ) {
          rows.push(childVNode);
        }
      });

    const mapGutters = childVNode => {
      return {
        element: childVNode.elm,
        track: childVNode.componentInstance.$props.track
      };
    };

    const columnGutters = columns.map(mapGutters);
    const rowGutters = rows.map(mapGutters);

    this.instance = SplitGrid({
      ...this.$props,
      columnGutters,
      rowGutters,
      onDrag: this.onDrag,
      onDragStart: this.onDragStart,
      onDragEnd: this.onDragEnd
    });
  },
  beforeDestroy() {
    this.instance.destroy(true);
  },
  methods: {
    onDrag(direction, track, gridTemplateStyle) {
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
  }
};
</script>
<template>
  <div class="vsg_split-grid">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.vsg_split-grid {
  display: grid;
  box-sizing: border-box;
  height: 100%;
}
</style>
