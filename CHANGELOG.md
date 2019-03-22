# Changelog
All notable changes to Vue Split Grid will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.5.0] 
### Added
- 'transition' property to SplitGrid, SplitGridArea and SplitGridGutter to allow transition, under the hood the native Vue `<transition>` element is used.

## [0.4.0] Initial ready release
### Added
- Implemented all off Split Grids options and events from [version 1.0.9](https://github.com/nathancahill/split/tree/52d003dcd49f4d4e0f77ba851f8a03a942c6860f/packages/split-grid). Split Grids API methods are used reactively by the components.
- 'drag', 'drag-start' and 'drag-end' **events** for respectively the 'onDrag', 'onDragStart' and 'onDragEnd' properties in Split Grid
- 'direction' property to the SplitGrid component to automatically determine if existing Gutters should be added as a row or column gutter.
- 'show' property to SplitGrid, SplitGridArea and SplitGridGutter to be able to reinitialize the gutters when the user toggles a row or column.
- 'size' property to the SplitGrid and SplitGridArea components so the SplitGrid component can dynamically set the correct CSS value for either `grid-template-rows` or `grid-template-columns`.
- 'animation' property to the SplitGrid component to implement animations when the size of a nested SplitGrid or a SplitGridArea has been changed (by using the 'size' property).
- 'gutterSize' property to the SplitGrid component to implement a default size for SplitGridGutters. This property also exists on the SplitGridGutter component.
- Ability to toggle columns or rows using `v-if` or our custom `:show` property.