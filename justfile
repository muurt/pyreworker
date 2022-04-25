alias d := default

host := `uname -a`

# build & start the project
default:
  npm run build && npm run start

# update & install npm packages (must have updates)
update:
  updates -u && npm i

# lint the project
lint:
  npm run lint

# build the project
build:
  npm run build

# start the project
start:
  npm run start

# lint, build & start the project
all:
  npm run lint && npm run build && npm run start

# pull the latest changes from the git
pull:
  git pull

# add all new files to git
add:
  git add .

# add specfic new file/dir to git
addf ARGS:
  git add {{ARGS}}

# commit changes to git
commit:
  git commit

# push changes to the repo
push:
  git push

# pull changes, add new files, commit and push to git
git:
  git pull && git add . && git commit && git push
