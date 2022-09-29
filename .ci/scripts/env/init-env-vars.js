#!/usr/bin/env node

var fs = require('fs');
const CONFIG = require('../../../.projectconfig.js');

// Check for required variables.
// TZ: "/usr/share/zoneinfo/America/New_York",
// TEMP_DIR: "../",
// CMS_PLATFORM: 'D9',
// DEFAULT_SITE: "panth-github-actions",
// testingPaths: []

let errs = [];
if (!CONFIG.TZ) {
  errs.push("The 'TZ' variable needs to be set in .projectconfig.js");
}
if (!CONFIG.TEMP_DIR) {
  errs.push("The 'TEMP_DIR' variable needs to be set in .projectconfig.js");
}
if (!CONFIG.CMS_PLATFORM) {
  errs.push("The 'CMS_PLATFORM' variable needs to be set in .projectconfig.js");
}
if (!CONFIG.DEFAULT_SITE) {
  errs.push("The 'DEFAULT_SITE' variable needs to be set in .projectconfig.js");
}
if (!CONFIG.testingPaths) {
  errs.push("The 'testingPaths' variable needs to be set in .projectconfig.js");
}
if (!CONFIG.foo) {
  errs.push("The 'foo' variable needs to be set in .projectconfig.js");
}
if (!CONFIG.bar) {
  errs.push("The 'bar' variable needs to be set in .projectconfig.js");
}

if (errs.length > 0) {
  console.log(errs.join("\n"));
  process.exit(1);
}

// Save Config as settings.
fs.writeFileSync('.projectconfig.json', JSON.stringify(CONFIG, null, 2));
