<template>
  <div id="app">
    <input
      id=""
      v-model="hide"
      type="checkbox"
      name="">
    <SplitGrid
      class="sb_split-grid"
      v-bind="splitGridOptions"
      @drag="log('drag', $event)"
      @drag-start="log('drag-start', $event)"
      @drag-end="log('drag-end', $event)">
      <SplitGrid
        v-bind="splitGridOptions"
        class="sb_sub-grid"
        @drag="log('drag', $event)"
        @drag-start="log('drag-start', $event)"
        @drag-end="log('drag-end', $event)">
        <SplitGridArea>column 1</SplitGridArea>
        <SplitGridGutter
          direction="vertical" />
        <SplitGridArea>column 2</SplitGridArea>
        <SplitGridGutter
          v-if="!hide"
          direction="vertical" />
        <SplitGridArea v-if="!hide">
          column 3
        </SplitGridArea>
      </SplitGrid>
      <SplitGridGutter
        direction="horizontal" />
      <SplitGridArea>
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
      splitGridOptions: {
        minSize: 100,
        columnMinSize: 250,
        rowMinSize: 100,
        columnMinSizes: null,
        rowMinSizes: null,
        snapOffset: 0,
        columnSnapOffset: 0,
        rowSnapOffset: 0,
        dragInterval: 5,
        columnDragInterval: 5,
        rowDragInterval: 5,
        cursor: null,
        columnCursor: null,
        rowCursor: null,
        writeStyle: this.writeStyle
      },
      hide: false
    };
  },
  methods: {
    log() {
      console.log(...arguments);
    },
    writeStyle(grid, gridTemplateProp, gridTemplateStyle) {
      grid.style[gridTemplateProp] = gridTemplateStyle
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
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 5px 1fr;
}
.sb_sub-grid {
  grid-template-columns: 1fr 5px 1fr 5px 1fr;
}
</style>
