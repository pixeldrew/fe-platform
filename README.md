### platform v2

**Problem,** - Current FE build pipeline has limitations in that components are bundled into templates (in the platform 
a template is represented as a mediator).
These templates can not have different views or extend the platform component because the same compiled component is 
reused across themes.

A POC is required to decouple the platform javascript from a theme's implementation of the platform. 
 
#### Platform Requires Support For:
* Ability To Publish As A Standalone NPM Module and be consumed by Theme packages
* Support Cross Platform Development
* Template bundling
* Unit Testing
* Code Coverage Of Platform Components

#### Themes Requires Support For:
* Override/Extend Platform Components
* Unit Testing New Components
* Code Coverage Of Theme Components

#### Webpack Build Benefits:
* Server side Bundling (for both Node and Nashorn interpreter to allow for server side rendering)
* Template (mediators) Bundling Produces CSS. Webpack can also inline/process/copy style assets (images, fonts)
* CSS is de-duplicated into a Common Layer (no more duplication of component styles across templates)
* Local Development can support Hot Module Reloading with inline linting/error display
* Tree Shaking of unused modules

### Important Concepts To Be Aware Of:
The build process has reliance on alias'. Using webpack resolve and npm resolve, you can use alias' to find psuedo 
packages.

The platform components define a "platform-theme" psuedo package which points to the theme folder in the current package. 
In the cun-them it overrides the platform themes with it's own CSS. Look at the app.js and webpack.config.js to make 
sure you're aware of how this works.


### Testing this POC
This POC requires that a local npm repository is setup and a carnival-abg user/scope is added to it. A good private npm 
repo is veradaccio, it has it's own docker install. (See instructions [here](https://github.com/verdaccio/verdaccio]))

To not use a local npm repo you can set the version to a path URL in the package.json, ie:

```json
"dependencies": {
    "@carnival-abg/platform": "file:../platform/"
  },
```
 
### Run
```sh
# This assumes you have setup verdaccio and have an @carnvial-abg user
cd platform; npm i; npm publish

cd ../cun-theme; npm i; PORT=3034 node app &

# platform version of home page
open 'http://localhost:3033/templates/home'
open 'http://localhost:3033/templates/aboutUs'

# cunard version of home page
open 'http://localhost:3034/templates/home'
open 'http://localhost:3034/templates/aboutUs'
```

### Build Output
Build assets are output to the /dist directory. AEM assets are output into a jcr_root folder. Theme assets are copied to 
/etc/design/<package_name>. Nashorn Server-side bundle is located in /apps/<package-name>/server.js.
Also output is the Babel Transpiled ES5 code With ES6 import statements preserved to support webpack tree shaking.

### Outcome
This POC successfully addresses the FE concerns about ability to implement different features in different brands.

### Steps Forward
Port v1 platform components to new build process by:
* Identifing all component style dependencies 
* Update components to require style dependencies and theme alias (see platform example)
* Fix v1 platform dependencies
* Implement new build setup
* Add ability in AEM to identify which theme to use per template
* Refactor Nashorn renderer to load theme sepcific SSR bundle and render theme specific component
