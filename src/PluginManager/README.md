# Renderly Plugin Manager

This section of code defines the behavior of Plugins, as well as the code that allows plugins to function within the editor.

## What is a Plugin?

A Plugin for Renderly can be:
1. A `Component` that describes some interaction with a student. `Component`s generally provide HTML that will be shown when someone drags them into their problem.
2. A `Solver` that runs code based on user input. Renderly provides a `Python` `Solver` by default, with access to several scientific computing modules.
  `Solver`s must provide bindings to define variable creation, randomization, and bounding.

## Component Plugins

A `Component` Plugin implements the `ComponentPlugin` interface, which defines all the methods that need to exist, and a number of optionally required methods.

A `Component` must have a `displayName`, and can optionally have a `Logo`. These get shown in the right-handed `Components` list in the Problem Editor.

A `Component` must implement a `getBodyHTML()` function that returns valid HTML. This will be used to generate the content that fills the Problem Editor.

A `Component` must also implement a `getBodyAnswers()` function that collects and formats a student's answers before it gets passed to the `Solver`.

A `Component` must finally implement a `getVariableAPI()` function that returns a JSON object describing how users can inject variables into the component.

## Component Plugin Example

The quinessential plugin example is a Chart Plugin, that allows users to drag and drop a chart into their problem for basic Statistics questions.
