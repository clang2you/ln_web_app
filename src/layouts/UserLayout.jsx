import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, connect, FormattedMessage } from 'umi';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = (props) => {
	const {
		route = {
			routes: []
		}
	} = props;
	const { routes = [] } = route;
	const {
		children,
		location = {
			pathname: ''
		}
	} = props;
	const { formatMessage } = useIntl();
	const { breadcrumb } = getMenuData(routes);
	const title = getPageTitle({
		pathname: location.pathname,
		formatMessage,
		breadcrumb,
		...props
	});
	return (
		<HelmetProvider>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={title} />
			</Helmet>

			<div className={styles.container}>
				<div className={styles.lang}>
					<SelectLang />
				</div>
				<div className={styles.content}>
					<div className={styles.top}>
						<div className={styles.header}>
							<Link to="/">
								<img alt="logo" className={styles.logo} src={logo} />
								<span className={styles.title}>LN WebApp</span>
							</Link>
						</div>
						<div className={styles.desc}>
							<FormattedMessage
								id="pages.layouts.userLayout.title"
								defaultMessage="Powered by react / ant design"
							/>
						</div>
					</div>
					{children}
				</div>
				<DefaultFooter
					copyright={`LN3 ${new Date().getFullYear()}`}
					links={[
						// {
						// 	key: 'question',
						// 	title: '我有疑问',
						// 	href: 'https://pro.ant.design',
						// 	blankTarget: true
						// },
						// {
						// 	key: 'improvment comments',
						// 	title: '改善建议',
						// 	href: 'https://ant.design',
						// 	blankTarget: true
						// }
					]}
				/>
			</div>
		</HelmetProvider>
	);
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
