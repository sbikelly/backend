const updateUser = async (req, res) => {

	const user = req.session.user;
	const { id } = req.params;
  
	if (!mongoose.Types.ObjectId.isValid(id)) {
	  res.render('admin/404',
		{ 
		  title: 'User Not Found', 
		  errorCode: '404',
		  User: user, 
		  main: 'No User with such IdD can be found on the database', 
		  additnMessage: err
		}            
	  );
	}
  
	try {
	  await User.findOneAndUpdate({_id: id}, {
		...req.body
	  })
	} catch (err) {
	  res.render('admin/404',
		{ 
		  title: 'User Not Found', 
		  errorCode: '404',
		  User: user, 
		  main: 'No User with such IdD can be found on the database', 
		  additnMessage: err
		}            
	  );
	}
  }