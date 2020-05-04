#!/bin/bash

##
# Color definitions.
##
source shell/colors.sh ''

##
# Exits with error.
##
exitWithError() {
  exit 1
}

##
# Reports usage error and exits.
##
reportUsage() {
  local TITLE="<< USAGE >>"
  printf "
    ${LIGHT_BLUE}%s\n
    ${DEFAULT} - ${YELLOW} bash shell/install.sh${DEFAULT} (print install.sh usage)
    ${DEFAULT} - ${YELLOW} bash shell/install.sh ?${DEFAULT} (print install.sh usage)
    ${DEFAULT} - ${YELLOW} bash shell/install.sh project${DEFAULT} (install all project dependencies: in project root, and in functions folder)
    ${DEFAULT} - ${YELLOW} bash shell/install.sh global${DEFAULT} (install global dependencies only)
    ${DEFAULT}\n\n" "$TITLE"
}

if [ $# -ne 1 ] || [ "$1" = "?" ]; then
  reportUsage
elif [ "$1" = "project" ]; then
  TITLE="<< INSTALLING FIREBASE FUNCTIONS DEPENDENCIES >>"
  printf "
    ${LIGHT_BLUE}%s
    ${DEFAULT}\n\n" "$TITLE"
  cd ./functions || exit
  npm install

  TITLE="<< INSTALLING PROJECT DEPENDENCIES >>"
  printf "
    ${LIGHT_BLUE}%s
    ${DEFAULT}\n\n" "$TITLE"
  cd ..
  yarn install
elif [ "$1" = "global" ]; then
  TITLE="<< INSTALLING GLOBAL DEPENDENCIES >>"
  printf "
    ${LIGHT_BLUE}%s
    ${DEFAULT}\n\n" "$TITLE"
  sudo npm install -g @angular/cli@latest typescript@latest firebase-tools@latest @compodoc/compodoc@latest @ngxs/cli@latest commitizen@latest cz-conventional-changelog@latest yarn || exitWithError
else
  TITLE="<< ERROR >>"
  printf "
    ${RED}%s
    ${LIGHT_RED}- wrong argument: ${1}
    ${DEFAULT}\n\n" "$TITLE"
  reportUsage
  exitWithError
fi
