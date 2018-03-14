module.exports = dev => (err, req, res, next) => {
	if (dev) {
	  console.error(err);
	}
  
	if (err.code === 'EBADCSRFTOKEN') {
	  res.status(403).send('Cross-site forgery request detected');
	} else {
	  res.status(500).send(err);
	}
  };