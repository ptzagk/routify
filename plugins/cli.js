#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const { execSync } = require('child_process')
const { start } = require('../lib/services/interface')
const { exporter } = require('../lib/services/exporter')
const defaults = require('../config.defaults.json')
const log = require('../lib/services/log')

let isCommand = false
program
  .option('-d, --debug', 'extra debugging')
  .option('-p, --pages <location>', 'path/to/pages', defaults.pages)
  .option(
    '-i, --ignore <list>',
    'Files and dirs. Can be string or array. Interpreted as regular expression', defaults.ignore
  )
  .option(
    '-u, --unused-prop-warnings', 'Show warnings about unused props passed by filerouter', defaults.unknownPropWarnings) //todo, replace unknownPropWarnings
  .option(
    '-D, --dynamic-imports', 'Code splitting)', defaults.dynamicImports
  )
  .option('-b, --single-build', "Don't watch for file changes", defaults.singleBuild)
  .option('-s, --scroll [behavior]', "Scroll behavior", defaults.scroll)
  .option('-e, --extensions <names>', "Comma separated extensions", defaults.extensions)


program
  .command('init')
  .action(() => {
    isCommand = true
    fs.readdir('./', (err, files) => {
      if (err) log(err)
      else if (files.length) log('Can only init in an empty directory.')
      else {
        log('Fetching template')
        execSync('npx degit https://github.com/sveltech/routify-starter')
        log('Installing dependencies')
        execSync('npm i')
        execSync('npm run dev', { stdio: 'inherit' })
      }
    })
  })

program
  .command('export')
  .option('-o --output <path>', 'Dist folder', defaults.distDir)
  .option('-r --routes <path>', 'Routify dir', defaults.routifyDir)
  .option('-p --no-prerender', 'Don\'t prerender static pages', defaults.noPrerender)
  .action(options => {
    isCommand = true
    exporter(options.opts())
  })


program.parse(process.argv)
if (!isCommand) {
  start(program.opts())
}