#!/bin/bash

##
# Colors:
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE.
##
source shell/colors.sh

##
# Usage:
# > bash build.sh - build app in development mode
# > bash build.sh prod - build app in production mode
##

devModeNgBuild () {
  printf "\n ${LIGHT_BLUE}<< BUILDING APPLICATION DEFINED IN angular.json DEV MODE >>${DEFAULT}\n\n"
  npm run ng-build
}

prodModeNgBuild () {
  printf "\n ${LIGHT_BLUE}<< BUILDING APPLICATION DEFINED IN angular.json PROD MODE >>${DEFAULT}\n\n"
  npm run ng-build-prod
}

##
# Builds application:
# - sets client app environment variables;
# - builds application using Angular CLI;
# - resets client app environment variables.
##
buildApplication () {
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

buildApplication $1
