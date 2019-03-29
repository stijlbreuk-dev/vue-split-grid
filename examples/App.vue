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
      v-model="showColumn3"
      type="checkbox"
      name="showColumn3"
    >
    <label for="showColumn3">Show column 3</label>
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
        :render="showRow1"
        v-bind="splitGridOptions"
        :strictMode="false"
        class="sb_sub-grid"
        @drag="log('drag', $event)"
        @drag-start="log('drag-start', $event)"
        @drag-end="log('drag-end', $event)"
      >
        <SplitGridArea
          size-unit="px"
          :size-value="250"
        >
          column 1
        </SplitGridArea>
        <SplitGridGutter />
        <SplitGridArea>
          column 2
        </SplitGridArea>
        <SplitGridGutter
          :show="showColumn3"
          :transition="transition"
        />
        <ReadabilityWrapper :showColumn3="showColumn3"></ReadabilityWrapper>
      </SplitGrid>
      <SplitGridGutter :render="showRow1" />
      <SplitGridArea
        :size-unit="size.unit"
        :size-value="size.value"
      >
        row 2
      </SplitGridArea>
    </SplitGrid>
  </div>
</template>
<script>
import ReadabilityWrapper from './components/ReadabilityWrapper';

export default {
  name: 'App',
  components: {
    ReadabilityWrapper
  },
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
        columnMinSizes: { 0: 250 },
        rowMinSizes: null,
        snapOffset: 0,
        columnSnapOffset: 0,
        rowSnapOffset: 0,
        dragInterval: 5,
        columnDragInterval: 5,
        rowDragInterval: 5,
        writeStyle: this.writeStyle
      },
      showRow1: true,
      showColumn3: false,
      toggleSize: false,
      transition: {
        name: 'slide-to-left',
        duration: 200
      }
    };
  },
  computed: {
    size() {
      return this.toggleSize
        ? { value: 500, unit: 'px' }
        : { value: 50, unit: 'px' };
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;

  label {
    margin-right: 1rem;
  }
}

.sb_split-grid {
  height: calc(100% - 30px);
}

.sb_sub-grid {
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-to-right-enter-active,
.slide-to-right-leave-active {
  transition: opacity 0.2s, transform 0.2s ease;
}
.slide-to-right-enter,
.slide-to-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-to-left-enter-active,
.slide-to-left-leave-active {
  transition: opacity 0.2s, transform 0.2s ease;
}
.slide-to-left-enter,
.slide-to-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
