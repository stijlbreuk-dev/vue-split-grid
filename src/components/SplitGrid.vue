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
      default() {
        return this.minSize;
      }
    },
    rowMinSize: {
      type: Number,
      default() {
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
      default() {
        return this.snapOffset;
      }
    },
    rowSnapOffset: {
      type: Number,
      default() {
        return this.snapOffset;
      }
    },
    dragInterval: {
      type: Number,
      default: 1
    },
    columnDragInterval: {
      type: Number,
      default() {
        return this.dragInterval;
      }
    },
    rowDragInterval: {
      type: Number,
      default() {
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
          columns.push({
            element: childVNode.elm,
            track: childVNode.componentInstance.$props.track
          });
        } else if (
          childVNode.componentInstance.$props.direction === 'horizontal'
        ) {
          rows.push({
            element: childVNode.elm,
            track: childVNode.componentInstance.$props.track
          });
        }
      });

    this.instance = SplitGrid({
      columnGutters: columns,
      rowGutters: rows,
      ...this.$props
    });
  },
  beforeDestroy() {
    this.instance.destroy(true);
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
