<template>
  <div id="app">
    <SplitGrid class="sb_split-grid"
               v-bind="splitGridOptions">
      <SplitGrid v-bind="splitGridOptions"
                 class="sb_sub-grid">
        <SplitGridArea>column 1</SplitGridArea>
        <SplitGridGutter :track="1"
                         direction="vertical" />
        <SplitGridArea>column 2</SplitGridArea>
        <SplitGridGutter :track="3"
                         direction="vertical" />
        <SplitGridArea>column 3</SplitGridArea>
      </SplitGrid>
      <SplitGridGutter :track="1"
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
        columnDragInter5al: 5,
        rowDragInterval: 5,
        cursor: null,
        columnCursor: null,
        rowCursor: null
      }
    };
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
