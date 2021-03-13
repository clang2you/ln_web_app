/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useIntl, connect, history, matchPath } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';
const noMatch = (
	<Result
		status={403}
		title="403"
		subTitle="Sorry, you are not authorized to access this page."
		extra={
			<Button type="primary">
				<Link to="/user/login">Go Login</Link>
			</Button>
		}
	/>
);

/** Use Authorized check all menu item */
// const menuDataRender = (menuList) =>
// 	menuList.map((item) => {
// 		const localItem = {
// 			...item,
// 			children: item.children ? menuDataRender(item.children) : undefined
// 		};
// 		return Authorized.check(item.authority, localItem, null);
// 	});

// const {
// 	dispatch,
// 	children,
// 	settings,
// 	location = {
// 		pathname: '/'
// 	},
// 	menuData
// } = props;

const defaultFooterDom = (
	<DefaultFooter
		copyright={`${new Date().getFullYear()} Design & Coding By LN3 IT`}
		links={[
			{
				key: 'question',
				title: '我有疑问',
				href: 'https://pro.ant.design',
				blankTarget: true
			},
			// {
			//   key: 'github',
			//   title: <GithubOutlined />,
			//   href: 'https://github.com/ant-design/ant-design-pro',
			//   blankTarget: true,
			// },
			{
				key: 'improvment comments',
				title: '改善建议',
				href: 'https://ant.design',
				blankTarget: true
			}
		]}
	/>
);

const BasicLayout = (props) => {
	// console.log(props)
	const {
		dispatch,
		children,
		settings,
		location = {
			pathname: '/'
		},
		menuData
	} = props;

	useEffect(() => {
		if (dispatch) {
			dispatch({
				type: 'menu/fetchMenu'
			});
		}
	}, []);


	const menuDataRender = () => {
		const transMenuItem = [];
		console.log("test",menuData)
		if (Array.isArray(menuData)) {
			menuData.forEach((v) => {
				const localV = { ...v, children: v.children ? menuDataRender(v.children) : [] };
				const localMenuDataItem = Authorized.check(v.authority, localV, null);
				transMenuItem.push(localMenuDataItem);
			});
		}
		// console.log(transMenuItem)
		return transMenuItem;
	};

	// const menuDataRender = serverMenuItem;
	const menuDataRef = useRef([]);

	/** Init variables */

	const handleMenuCollapse = (payload) => {
		if (dispatch) {
			dispatch({
				type: 'global/changeLayoutCollapsed',
				payload
			});
		}
	}; // get children authority

	// const authorized = useMemo(
	//   () =>
	//     getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
	//       authority: undefined,
	//     },
	//   [location.pathname],
	// );

	/*
    antd pro v4 的 bug，从 menu 数据中匹配路由，如果没有权限访问的页面
    会返回 authority:undefined，这样会造成虽然菜单中不会出现对应的页面
    但在地址栏输入对应的地址还是可以跳转访问，故修改了 basicLayout 中的
    authorized 方法，页面鉴权改为从路由匹配，这样可以保证没有权限的用户
    无法透过地址栏来访问相关页面（会跳转到 403 页面）
  */
	const { route: routeForAuthorized } = props;
	const authorized = useMemo(
		() => {
			const path = location.pathname;
			const list = [ routeForAuthorized ];
			let current = routeForAuthorized;
			while (current) {
				if (!current.children) break;
				current = current.children
					.filter((it) => it.path)
					.sort((a, b) => b.path.length - a.path.length)
					.find((it) => matchPath(path, it));
				if (!current) break;
				list.unshift(current);
			}
			return {
				authority: list.map((it) => it.authority).find((it) => it)
			};
		},
		[ routeForAuthorized, location.pathname ]
	);

	const { formatMessage } = useIntl();
	return (
		<ProLayout
			logo={logo}
			formatMessage={formatMessage}
			{...props}
			{...settings}
			onCollapse={handleMenuCollapse}
			onMenuHeaderClick={() => history.push('/')}
			menuItemRender={(menuItemProps, defaultDom) => {
				if (menuItemProps.isUrl || !menuItemProps.path || location.pathname === menuItemProps.path) {
					return defaultDom;
				}

				return <Link to={menuItemProps.path}>{defaultDom}</Link>;
			}}
			breadcrumbRender={(routers = []) => [
				{
					path: '/',
					breadcrumbName: formatMessage({
						id: 'menu.home'
					})
				},
				...routers
			]}
			itemRender={(route, params, routes, paths) => {
				const first = routes.indexOf(route) === 0;
				return first ? (
					<Link to={paths.join('/')}>{route.breadcrumbName}</Link>
				) : (
					<span>{route.breadcrumbName}</span>
				);
			}}
			footerRender={() => {
				if (settings.footerRender || settings.footerRender === undefined) {
					return defaultFooterDom;
				}

				return null;
			}}
			menuDataRender={menuDataRender}
			rightContentRender={() => <RightContent />}
			postMenuData={(menuData) => {
				menuDataRef.current = menuData || [];
				return menuData || [];
			}}
		>
			<Authorized authority={authorized.authority} noMatch={noMatch}>
				{children}
			</Authorized>
		</ProLayout>
	);
};

export default connect(({ global, settings, menu }) => ({
	collapsed: global.collapsed,
	settings,
	menuData: menu.menuData
}))(BasicLayout);
