# Changelog

All notable changes to Vue Split Grid will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.8.0]

### Added

- 'cancelTransition' property to cancel a transition after setting 'render' or 'show' to `false`.

## [0.7.1]

### Changed

- Updated README.md
 
## [0.7.1]

### Added

- 'strictMode' property to SplitGrid which, when set to false, allows the use of custom child components in a SplitGrid. The custom components should only be used as a wrapper for a SplitGrid or SplitGridArea component to improve readability.

## [0.6.0]

### Added

- 'render' property to SplitGrid, SplitGridArea and SplitGridGutter which behaves like v-if to support using v-if in the transition elements in the Split* components.

### Changed

- 'size' property now exists of a 'sizeValue' and a 'sizeUnit' property.

### Removed

- 'size' property in favor of a 'sizeValue' and a 'sizeUnit' property

## [0.5.0]

### Added

- 'transition' property to SplitGrid, SplitGridArea and SplitGridGutter to allow transitions, under the hood the native Vue `<transition>` element is used.

### Fixed

- The CSS of a SplitGrid is no longer updated when a hidden element size changes.

## [0.4.0] Initial release

### Added

- Implemented all off Split Grids options and events from [version 1.0.9](https://github.com/nathancahill/split/tree/52d003dcd49f4d4e0f77ba851f8a03a942c6860f/packages/split-grid). Split Grids API methods are used reactively by the components.
- 'drag', 'drag-start' and 'drag-end' **events** for respectively the 'onDrag', 'onDragStart' and 'onDragEnd' properties in Split Grid
- 'direction' property to the SplitGrid component to automatically determine if existing Gutters should be added as a row or column gutter.
- 'show' property to SplitGrid, SplitGridArea and SplitGridGutter to be able to reinitialize the gutters when the user toggles a row or column.
- 'size' property to the SplitGrid and SplitGridArea components so the SplitGrid component can dynamically set the correct CSS value for either `grid-template-rows` or `grid-template-columns`.
- 'animation' property to the SplitGrid component to implement animations when the size of a nested SplitGrid or a SplitGridArea has been changed (by using the 'size' property).
- 'gutterSize' property to the SplitGrid component to implement a default size for SplitGridGutters. This property also exists on the SplitGridGutter component.
- Ability to toggle columns or rows using `v-if` or our custom `:show` property.
