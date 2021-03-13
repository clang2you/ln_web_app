export default {
	'POST /api/get_menu': {
		code: 0,
		message: 'response sucessful',
		data: [
			{
				path: '/welcome',
				name: 'welcome',
				children: null,
				authority: [ 'user', 'admin' ]
			},
			{
				path: '/admin',
				name: 'admin',
				children: [
					{
						path: '/admin/sub-page',
						name: 'sub-page',
						children: null,
						authority: [ 'admin' ]
					}
				],
				authority: [ 'admin' ]
			}
		]
	}
};
