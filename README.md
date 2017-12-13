### css-next parent/child setup

Test to see if @apply will work in a parent/dependant package 

Was broken in prior release

### run
```sh
cd parent; npm i; PORT=3033 node app &
cd ../dependant; npm i; PORT=3034 node app &

# check http://localhost:3034/css/index.css
```
