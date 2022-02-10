# This tool is currently in development and is very likely to make sudden and breaking changes.

## About

This is a math problem editor, nicknamed 'Renderly'. It is inspired by the WeBWorK project.

Here are some of the intended features:
* A drag-and-drop interface with various plugins to help visually construct a math problem. 
* Explicitly defined variables with randomization and limits.
* The ability to unit-test problems.
* Easy support for adding new plugins.

## Setup

Currently, this project is standalone and simply requires `npm start` to run. There are not currently any production recommendations for deployment.

## Contributings

PRs are welcome, particularly to add new Plugins to in `src\PluginManager`. New PRs should not introduce new linter warnings, and include commented reasons if checks are disabled.