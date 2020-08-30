#!/bin/bash

##
# Color definitions.
##
source shell/colors.sh ''

# manual mode if no params are provided
if [ 18 -eq $# ]; then
  # map arguments
  soundcloudClientId=$1
  firebaseApiKey=$2
  firebaseAuthDomain=$3
  firebaseDatabaseUrl=$4
  firebaseProjectId=$5
  firebaseStorageBucket=$6
  firebaseMessagingSenderId=$7
  privilegedAccessFirebaseUid=$8
  googleApisBrowserKey=${9}
  googleApisClientId=${10}
  mailerHost=${11}
  mailerPort=${12}
  mailerEmail=${13}
  mailerClientId=${14}
  mailerClientSecret=${15}
  mailerRefreshToken=${16}
  mailerAccessToken=${17}
  mailerRecipientEmail=${18}

  # summary check
  TITLE="<< You provided the following values >>"
  printf "${LIGHT_BLUE} %s
    \n# client variables:\n
    - ${YELLOW}SOUNDCLOUD_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${soundcloudClientId}${LIGHT_BLUE}
    - ${YELLOW}FIREBASE_API_KEY${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseApiKey}${LIGHT_BLUE}
    - ${YELLOW}FIREBASE_AUTH_DOMAIN${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseAuthDomain}${LIGHT_BLUE}
    - ${YELLOW}FIREBASE_DATABASE_URL${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseDatabaseUrl}${LIGHT_BLUE}
    - ${YELLOW}FIREBASE_PROJECT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseProjectId}${LIGHT_BLUE}
    - ${YELLOW}FIREBASE_STORAGE_BUCKET${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseStorageBucket}${LIGHT_BLUE}
    - ${YELLOW}FIREBASE_MESSAGING_SENDER_ID${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseMessagingSenderId}${LIGHT_BLUE}
    - ${YELLOW}PRIVILEGED_ACCESS_FIREBASE_UID${LIGHT_BLUE}=${LIGHT_GREEN}${privilegedAccessFirebaseUid}${LIGHT_BLUE}
    - ${YELLOW}GOOGLE_APIS_BROWSER_KEY${LIGHT_BLUE}=${LIGHT_GREEN}${googleApisBrowserKey}${LIGHT_BLUE}
    - ${YELLOW}GOOGLE_APIS_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${googleApisClientId}${LIGHT_BLUE}
    \n# functions variables:\n
    - ${YELLOW}MAILER_HOST${LIGHT_BLUE}=${LIGHT_GREEN}${mailerHost}${LIGHT_BLUE}
    - ${YELLOW}MAILER_PORT${LIGHT_BLUE}=${LIGHT_GREEN}${mailerPort}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_EMAIL${LIGHT_BLUE}=${LIGHT_GREEN}${mailerEmail}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${mailerClientId}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_SECRET${LIGHT_BLUE}=${LIGHT_GREEN}${mailerClientSecret}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_REFRESH_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${mailerRefreshToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${mailerAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_RECIPIENT_EMAIL${LIGHT_BLUE}=${LIGHT_GREEN}${mailerRecipientEmail}${LIGHT_BLUE}\n" "@TITLE"

  # write client .env
  echo "SOUNDCLOUD_CLIENT_ID=${soundcloudClientId}" >./.env
  echo "FIREBASE_API_KEY=${firebaseApiKey}" >>./.env
  echo "FIREBASE_AUTH_DOMAIN=${firebaseAuthDomain}" >>./.env
  echo "FIREBASE_DATABASE_URL=${firebaseDatabaseUrl}" >>./.env
  echo "FIREBASE_PROJECT_ID=${firebaseProjectId}" >>./.env
  echo "FIREBASE_STORAGE_BUCKET=${firebaseStorageBucket}" >>./.env
  echo "FIREBASE_MESSAGING_SENDER_ID=${firebaseMessagingSenderId}" >>./.env
  echo "PRIVILEGED_ACCESS_FIREBASE_UID=${privilegedAccessFirebaseUid}" >>./.env
  echo "GOOGLE_APIS_BROWSER_KEY=${googleApisBrowserKey}" >>./.env
  echo "GOOGLE_APIS_CLIENT_ID=${googleApisClientId}" >>./.env
  # notify user
  printf "${YELLOW} %s: ${GREEN}environment variables set in ${YELLOW}./.env${LIGHT_BLUE} file${DEFAULT} \n\n" "<< OK >>"

  # write functions .env
  echo "MAILER_HOST=${mailerHost}" >./functions/.env
  echo "MAILER_PORT=${mailerPort}" >>./functions/.env
  echo "MAILER_EMAIL=${mailerEmail}" >>./functions/.env
  echo "MAILER_CLIENT_ID=${mailerClientId}" >>./functions/.env
  echo "MAILER_CLIENT_SECRET=${mailerClientSecret}" >>./functions/.env
  echo "MAILER_REFRESH_TOKEN=${mailerRefreshToken}" >>./functions/.env
  echo "MAILER_ACCESS_TOKEN=${mailerAccessToken}" >>./functions/.env
  echo "MAILER_RECIPIENT_EMAIL=${mailerRecipientEmail}" >>./functions/.env
  # notify user
  printf "${YELLOW} %s: ${GREEN}environment variables set in ${YELLOW}./functions/.env${LIGHT_BLUE} file${DEFAULT} \n\n" "<< OK >>"

else
  TITLE="<< ERROR >>"
  DETAILS="you should provide 18 arguments"
  printf "${LIGHT_RED} %s: ${LIGHT_BLUE}%s:
    - ${YELLOW}SOUNDCLOUD_CLIENT_ID${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_API_KEY${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_AUTH_DOMAIN${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_DATABASE_URL${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_PROJECT_ID${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_STORAGE_BUCKET${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_MESSAGING_SENDER_ID${LIGHT_BLUE}\n
    - ${YELLOW}PRIVILEGED_ACCESS_FIREBASE_UID${LIGHT_BLUE}\n
    - ${YELLOW}GOOGLE_APIS_BROWSER_KEY${LIGHT_BLUE}\n
    - ${YELLOW}GOOGLE_APIS_CLIENT_ID${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_HOST${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_PORT${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_EMAIL${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_ID${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_SECRET${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_REFRESH_TOKEN${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_ACCESS_TOKEN${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_RECIPIENT_EMAIL${LIGHT_BLUE}\n" "$TITLE" "$DETAILS"
fi
