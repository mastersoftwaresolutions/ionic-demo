/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').waterlocked({
 
	register: function(req, res) {
		
		if (req.body.type === 'facebook') {

			registerFacebookUser(req.body);

		} else {
			registerAppUser(req.body);
		}

		function registerAppUser(input) {

			if (!input.name) {
				return res.json({
					message: 'name can not be blank'
				}, 400);
			}
			if (!input.email) {
				return res.json({
					message: 'email can not be blank'
				}, 400);
			}
			if (!input.password) {
				return res.json({
					message: 'password can not be blank'
				}, 400);
			}

			User.findOne({
				email: input.email
			}).exec(function(err, user) {
				if (err) return res.json(err, 400); 
				if (user) {
					return res.json({
						message: 'email ' + input.email + ' is alredy exists'
					}, 400);
				} else {
					User.signup({
						name: input.name,
						email: input.email,
						password: input.password
					}, function(err, user) {

						if (err) return res.json(err, 400); 

						if (input.wantsJSON) {
							return res.json(user);
						}
						return res.redirect('/#login');
					});
				}
			});
		}

		function registerFacebookUser(input) { 
			User.findOne({
				profileId: input.profileId
			}).exec(function(err, user) {
				if (err) return res.json(err, 400); 
				if (user) {
					return res.json(user);
				} else {
					User.signup({
						name: input.name,
						email: input.email,
						profileId: input.profileId
					}, function(err, user) {
						
						if (err) return res.json(err, 400); 

							return res.json(user);
						
					});
				}
			});
		}
	},
});