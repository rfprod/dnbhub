/*
*	firebase mock
*/
var firebase = {
	initializeApp: () => true,
	database: () => {
		return {
			ref: () => {
				return {
					once: () => true,
					off: () => true
				};
			}
		};
	},
	auth: () => {
		return {
			onAuthStateChanged: () => true
		};
	}
};
