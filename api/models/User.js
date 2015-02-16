/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.user.attributes({
	 attempts: {
	  collection: 'attempt',
	  via: 'user'
	},
	jsonWebTokens: {
	  collection: 'jwt',
	  via: 'owner'
	},
	auth:{
	  model: 'auth'
	} 
  }),

  signup: function (inputs, cb) {
    // Create a user
    User.create({
      name: inputs.name,
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password,
      profileId: inputs.profileId
    })
    .exec(cb);
  },
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate
  // validateValues: function(attr, cb) {
  // 	_.each(attr, function(value, key){
  // 		if(value === '' || value === undefined || value === null){  	
  // 			console.log('here 1');		
  // 			cb(key + ' can not be blank',false);  			
  // 		}
  // 			if(key === 'email') {
  // 				User.findOne({email: value}).exec(function(err, user){
  // 					if(user) {
  // 						console.log('here 2');		
  // 						cb(key + ' ' + value + ' is already exists',false);
  // 					}else{
  // 						console.log('here 3');		
  // 						cb(null, true);
  // 					}
  // 				});
  // 			}
  // 	});
  // 	// console.log('here 4');		
  // 	// cb(null, true);
  // },
  
};
