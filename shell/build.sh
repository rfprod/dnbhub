#!/bin/bash

##
# Color definitions.
##
source shell/colors.sh ''

##
# Usage:
# > bash build.sh - build app in development mode
# > bash build.sh prod - build app in production mode
##

devModeNgBuild() {
  local TITLE
  TITLE="BUILDING APPLICATION DEFINED IN angular.json DEV MODE"
  printf "\n ${LIGHT_BLUE}<< %s >>${DEFAULT}\n\n" "$TITLE"
  npm run ng build
}

prodModeNgBuild() {
  local TITLE
  TITLE="BUILDING APPLICATION DEFINED IN angular.json PROD MODE"
  printf "\n ${LIGHT_BLUE}<< %s >>${DEFAULT}\n\n" "$TITLE"
  npm run ng build --prod
}

##
# Builds application:
# - sets client app environment variables;
# - builds application using Angular CLI;
# - resets client app environment variables.
##
buildApplication() {
  npm run set-client-app-env
  if [ $# -lt 1 ] || [ "$1" != "prod" ]; then
    devModeNgBuild
  else
    prodModeNgBuild
  fi
  npm run reset-client-app-env
}

##
# Builds applications defined in angular.json using Angular CLI.
##

buildApplication "$1"
