/*
*	firebase mock
*/
var firebase = {
	initializeApp: function() {
		return true;
	},
	database: function() {
		return {
			ref: function() {
				return {
					once: function() {
						return true;
					}
				};
			}
		};
	},
	auth: function() {
		return {
			onAuthStateChanged: function() {
				return true;
			}
		};
	}
};
