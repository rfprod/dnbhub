#!/bin/bash

##
# Colors:
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE.
##
source shell/colors.sh

##
# Usage:
# - bash shell/install.sh - installs project, and firebase functions dependencies
# - bash shell/install.sh project - installs project dependencies only
# - bash shell/install.sh firebase - installs firebase functions dependencies only
# - bash shell/install.sh global - - installs global dependencies only
##

##
# Install firebase functions npm dependencies.
##
installFirebaseDependencies () {
  printf "\n ${LIGHT_BLUE}<< INSTALLING FIREBASE FUNCTIONS DEPENDENCIES >>${DEFAULT}\n\n"
  cd functions
  npm install
}

##
# Installs project npm dependencies.
##
installProjectDependencies () {
  printf "\n ${LIGHT_BLUE}<< INSTALLING PROJECT DEPENDENCIES >>${DEFAULT}\n\n"
  npm install
}

##
# Install global dependencies.
##
installGlobalDependencies () {
  printf "\n ${LIGHT_BLUE}<< INSTALLING GLOBAL DEPENDENCIES >>${DEFAULT}\n\n"
  sudo npm install -g @angular/cli@latest typescript@latest firebase-tools@latest @compodoc/ngd-cli@latest @datorama/akita
}

##
# Installs dependencies in project root folder as well as in /functions if no arguments are provided.
# Installs global dependencies with sudo if first argument equals 'global'.
##

if [ $# -ne 1 ]; then
  installProjectDependencies
  installFirebaseDependencies
elif [ $1 = 'project' ]; then
  installProjectDependencies
elif [ $1 = 'firebase' ]; then
  installFirebaseDependencies
elif [ $1 = 'global' ]; then
  installGlobalDependencies
else
  printf "\n ${LIGHT_RED}<< ERROR: wrong argument: ${1} >>${DEFAULT}\n\n"
fi
