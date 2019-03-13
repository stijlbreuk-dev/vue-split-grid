import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/wrapper.js', // Path relative to package.json
  output: {
    name: 'VueSplitGrid',
    exports: 'named'
  },
  plugins: [
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true // Explicitly convert template to render function
    }),
    buble({
      objectAssign: 'Object.assign'
    }), // Transpile to ES5
    process.env.SB_MINIFY ? uglify() : undefined
  ]
};
