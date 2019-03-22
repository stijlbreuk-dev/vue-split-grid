<template>
  <div id="app">
    <input
      id=""
      v-model="showRow1"
      type="checkbox"
      name="showRow1"
    >
    <label for="showRow1">Show row 1</label>
    <input
      id=""
      v-model="showColumn2"
      type="checkbox"
      name="showColumn2"
    >
    <label for="showColumn2">Show column 2</label>
    <input
      id=""
      v-model="toggleSize"
      type="checkbox"
      name="toggle-size"
    >
    <label for="toggle-size">Toggle bottom row size</label>
    <SplitGrid
      class="sb_split-grid"
      v-bind="splitGridOptions"
      :animation="animation"
      direction="row"
      @drag="log('drag', $event)"
      @drag-start="log('drag-start', $event)"
      @drag-end="log('drag-end', $event)"
    >
      <SplitGrid
        v-if="showRow1"
        v-bind="splitGridOptions"
        class="sb_sub-grid"
        @drag="log('drag', $event)"
        @drag-start="log('drag-start', $event)"
        @drag-end="log('drag-end', $event)"
      >
        <SplitGridArea>column 1</SplitGridArea>
        <SplitGridGutter v-if="showColumn2" />
        <SplitGridArea v-if="showColumn2">
          column 2
        </SplitGridArea>
        <SplitGridGutter />
        <SplitGridArea>
          column 3
        </SplitGridArea>
      </SplitGrid>
      <SplitGridGutter v-if="showRow1" />
      <SplitGridArea :size="size">
        row 3
      </SplitGridArea>
    </SplitGrid>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      animation: {
        duration: 500,
        easing: 'easeInOutQuint'
      },
      splitGridOptions: {
        minSize: 100,
        columnMinSize: 35,
        rowMinSize: 25,
        columnMinSizes: null,
        rowMinSizes: null,
        snapOffset: 0,
        columnSnapOffset: 0,
        rowSnapOffset: 0,
        dragInterval: 5,
        columnDragInterval: 5,
        rowDragInterval: 5,
        // cursor: null,
        // columnCursor: null,
        // rowCursor: null,
        writeStyle: this.writeStyle
      },
      showRow1: true,
      showColumn2: false,
      toggleSize: false
    };
  },
  computed: {
    size() {
      return this.toggleSize ? { value: 500, unit: 'px'} : { value: 50, unit: 'px'};
    }
  },
  methods: {
    log() {
      console.log(...arguments);
    },
    writeStyle(grid, gridTemplateProp, gridTemplateStyle) {
      grid.style[gridTemplateProp] = gridTemplateStyle;
    }
  }
};
</script>
<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

.sb_split-grid {
  height: calc(100% - 30px);
}

.sb_sub-grid {
}
</style>
