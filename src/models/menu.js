import { getMenuData } from '@/services/menu';

const MenuModel = {
	namespace: 'menu',

	state: {
		menuData: []
	},

	effects: {
		*fetchMenu(_, { call, put }) {
			const response = yield call(getMenuData);
			yield put({
				type: 'saveMenuData',
				payload: response.data
			});
		}
	},

	reducers: {
		saveMenuData(state, action) {
			// console.log(action.payload)
			return {
				...state,
				menuData: action.payload || []
			};
		}
	}
};

export default MenuModel;
