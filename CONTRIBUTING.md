Sometimes, shy developers have wonderful ideas. So don't be shy and open an issue! :)

If you want to help me, modify the source code, but **before to create a pull request, follow these steps**

**Attention! This is really important**
Every time you'll run `npm install` inside an example's folder, you must rebuild all with `npm run build:all`

# A. Cleanup and initialization
1. `npm install -g lite-server @angular/cli@latest`
2. remove all `node_modules` and temp folders with compiled files (if necessary)
3. `npm install` (from the root of this project)
4. `npm run clean:all`
5. `cd examples/angular-cli-16`
6. `npm install`
7. `cd ../..`
8. `cd examples/universal`
9. `npm install`
10. `cd ../..`
11. `cd examples/angular-cli-material`
12. `npm install`
13. `cd ../..`
14. `npm run build:all`
15. `npm test`

# B. Run main example
1. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
2. `npm run build:main:dev`
3. `cd dist/angular-modal-gallery && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
4. `cd ../..`
5. `npm run build:main:prod`
6. `cd dist/angular-modal-gallery && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
7. `cd ../..`

# C. Run angular-cli-16 example
1. `cd examples/angular-cli-16`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/angular-cli && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../..`
6. `npm run build:prod`
7. `cd dist/angular-cli && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../..`

# D. Run angular-cli-material example
1. `cd examples/angular-cli-material`
2. `npm start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/angular-cli && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../..`
6. `npm run build:prod`
7. `cd dist/angular-cli && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../../../..`

# E. Run universal example
1. `cd examples/universal`
2. `npm run start` => if everything is ok (also in browser's console), kill the process and go to the next step
3. `npm run build:dev`
4. `cd dist/universal/browser && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
5. `cd ../../..`
6. `npm run build:prod`
7. `cd dist/universal/browser && lite-server` => if everything is ok (also in browser's console), kill the process and go to the next step
8. `cd ../../..`
9. `npm run build:ssr && npm run serve:ssr` => if everything is ok (also in browser's console), kill the process and go to the next step
10. `npm run prerender && npm run serve:ssr` => if everything is ok (also in browser's console), kill the process and go to the next step
11. `cd ../..`

# H. Create your pull request
1. **If it is ok, create your pull request specifying all the details**

<br/>
<br/>

# Only for the author @Ks89 - How to publish this on npm?

## Stable releases (@latest)
1. `cd projects/ks89/angular-modal-gallery`
2. `npm version patch` (x.x.1) or `npm version minor` (x.1.0) or `npm version major` (5.x.x)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `cd @ks89/angular-modal-gallery`
7. `npm publish`
8. `git push origin master`
9. `git push origin vx.x.x`  <-- tag name created by npm version (for instance v5.0.1)

## Beta and RC releases (@beta)
1. `cd projects/ks89/angular-modal-gallery`
2. Manually change the version of `./package.json` with either this format `x.x.x-beta.x` or `x.x.x-rc.x` (also respect semver!)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `cd @ks89/angular-modal-gallery`
7. `npm publish --tag beta`

## Alpha releases (@next)
1. `cd projects/ks89/angular-modal-gallery`
2. Manually change the version of `./package.json` with this format `x.x.x-alpha.x` (also respect semver!)
3. `cd ../..`
4. `npm run clean:all`
5. `npm run build:lib`
6. `cd @ks89/angular-modal-gallery`
7. `npm publish --tag next`
