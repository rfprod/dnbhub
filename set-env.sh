# colours
source util-echo_colours.sh
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE

printf "${GREEN} > you will be guided through steps needed to create ${YELLOW}.env${GREEN} file with api keys for integration with external services${DEFAULT} \n\n"
printf "${LIGHT_BLUE}  >> to do it you will be prompted for the current these values:\n - ${YELLOW}SOUNDCLOUD_CLIENT_ID${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_API_KEY${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_AUTH_DOMAIN${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_DATABASE_URL${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_PROJECT_ID${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_STORAGE_BUCKET${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_MESSAGING_SENDER_ID${LIGHT_BLUE}\n - ${YELLOW}PRIVILEGED_ACCESS_FIREBASE_UID${LIGHT_BLUE} \n\n"

# prompt user for variables one by one: SOUNDCLOUD_CLIENT_ID
printf "${LIGHT_BLUE}  >> step ${YELLOW}1/11 ${LIGHT_BLUE}: Enter ${YELLOW}SOUNDCLOUD_CLIENT_ID${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" soundcloudClientId

# prompt user for variables one by one: FIREBASE_API_KEY
printf "${LIGHT_BLUE}  >> step ${YELLOW}2/11 ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_API_KEY${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" firebaseApiKey

# prompt user for variables one by one: FIREBASE_AUTH_DOMAIN
printf "${LIGHT_BLUE}  >> step ${YELLOW}3/11 ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_AUTH_DOMAIN${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" firebaseAuthDomain

# prompt user for variables one by one: FIREBASE_DATABASE_URL
printf "${LIGHT_BLUE}  >> step ${YELLOW}4/11 ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_DATABASE_URL${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" firebaseDatabaseUrl

# prompt user for variables one by one: FIREBASE_PROJECT_ID
printf "${LIGHT_BLUE}  >> step ${YELLOW}5/11 ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_PROJECT_ID${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" firebaseProjectId

# prompt user for variables one by one: FIREBASE_STORAGE_BUCKET
printf "${LIGHT_BLUE}  >> step ${YELLOW}6/11 ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_STORAGE_BUCKET${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" firebaseStorageBucket

# prompt user for variables one by one: FIREBASE_STORAGE_BUCKET
printf "${LIGHT_BLUE}  >> step ${YELLOW}7/11 ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_STORAGE_BUCKET${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" firebaseMessagingSenderId

# prompt user for variables one by one: PRIVILEGED_ACCESS_FIREBASE_UID
printf "${LIGHT_BLUE}  >> step ${YELLOW}8/11 ${LIGHT_BLUE}: Enter ${YELLOW}PRIVILEGED_ACCESS_FIREBASE_UID${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" privilegedAccessFirebaseUid

# prompt user for variables one by one: GOOGLE_APIS_BROWSER_KEY
printf "${LIGHT_BLUE}  >> step ${YELLOW}8/11 ${LIGHT_BLUE}: Enter ${YELLOW}GOOGLE_APIS_BROWSER_KEY${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" googleApisBrowserKey

# prompt user for variables one by one: GOOGLE_APIS_CLIENT_ID
printf "${LIGHT_BLUE}  >> step ${YELLOW}8/11 ${LIGHT_BLUE}: Enter ${YELLOW}GOOGLE_APIS_CLIENT_ID${LIGHT_BLUE} ${DEFAULT} \n"
read -p "   > input value :" googleApisClientId

# summary check
printf "${LIGHT_BLUE}  >> step ${YELLOW}9/11 ${LIGHT_BLUE}: You provided the following values:\n - ${YELLOW}SOUNDCLOUD_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${soundcloudClientId}${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_API_KEY${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseApiKey}${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_AUTH_DOMAIN${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseAuthDomain}${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_DATABASE_URL${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseDatabaseUrl}${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_PROJECT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseProjectId}${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_STORAGE_BUCKET${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseStorageBucket}${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_MESSAGING_SENDER_ID${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseMessagingSenderId}${LIGHT_BLUE}\n - ${YELLOW}PRIVILEGED_ACCESS_FIREBASE_UID${LIGHT_BLUE}=${LIGHT_GREEN}${privilegedAccessFirebaseUid}${LIGHT_BLUE}\n -${YELLOW}GOOGLE_APIS_BROWSER_KEY${LIGHT_BLUE}=${LIGHT_GREEN}${googleApisBrowserKey}${LIGHT_BLUE}\n - ${YELLOW}GOOGLE_APIS_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${googleApisClientId}${LIGHT_BLUE} \n"

# notify user
printf "${LIGHT_BLUE}  >> step ${YELLOW}10/11 ${LIGHT_BLUE}: Compare changes with existing ${YELLOW}.env${LIGHT_BLUE} file${DEFAULT} \n\n"
cat ./.env

# prompt user whether to continue or not
printf "\n${LIGHT_BLUE}  >> step ${YELLOW}11/11 ${LIGHT_BLUE}: Continue and create/overwrite ${YELLOW}.env${LIGHT_BLUE} file${DEFAULT} \n"
read -p "   > continue (y/n) :" userChoice
case $userChoice in
	y|Y )
		# write file contents
		echo "SOUNDCLOUD_CLIENT_ID=${soundcloudUserId}" > ./.env
		echo "FIREBASE_API_KEY=${firebaseApiKey}" >> ./.env
		echo "FIREBASE_AUTH_DOMAIN=${firebaseAuthDomain}" >> ./.env
		echo "FIREBASE_DATABASE_URL=${firebaseDatabaseUrl}" >> ./.env
		echo "FIREBASE_PROJECT_ID=${firebaseProjectId}" >> ./.env
		echo "FIREBASE_STORAGE_BUCKET=${firebaseStorageBucket}" >> ./.env
		echo "FIREBASE_MESSAGING_SENDER_ID=${firebaseMessagingSenderId}" >> ./.env
		echo "PRIVILEGED_ACCESS_FIREBASE_UID=${privilegedAccessFirebaseUid}" >> ./.env
		echo "GOOGLE_APIS_BROWSER_KEY=${googleApisBrowserKey}" >> ./.env
		echo "GOOGLE_APIS_CLIENT_ID=${googleApisClientId}" >> ./.env
		# notify user
		printf "${YELLOW}  >> OK: ${GREEN}environment variables set in ${YELLOW}.env${LIGHT_BLUE} file${DEFAULT} \n\n"
		cat ./.env
		printf "\n"
		;;
	n|N )
		# notify user
		printf " ${GREEN}  >> cancelled by user, user choice: $userChoice ${DEFAULT} \n"
		;;
	* )
		# notify user
		printf " ${LIGHT_BLUE}  >> invalid value, user choise: ${RED}$userChoice ${DEFAULT} \n"
		;;
esac
