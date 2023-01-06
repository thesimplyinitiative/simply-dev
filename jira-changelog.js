const custom = require('@digitalroute/cz-conventional-changelog-for-jira/configurable');
const defaultOptions = require('@digitalroute/cz-conventional-changelog-for-jira/defaults');

const { FsTree } = require('nx/src/generators/tree');
const { getProjects, workspaceRoot } = require('@nrwl/devkit');

const options = defaultOptions;

const root = workspaceRoot;

const tree = new FsTree(root);

const scopes = ['root', ...getProjects(tree).keys()];

options.scopes = scopes;
options.customScope = false;
options.skipScope = false;
options.jiraOptional = true;
options.jiraPrepend = '[';
options.jiraAppend = ']';
options.maxHeaderWidth = 100;

module.exports = custom(options);
