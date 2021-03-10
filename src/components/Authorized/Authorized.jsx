import React from 'react';
import { Result } from 'antd';
import check from './CheckPermissions';

const Authorized = ({
  // 希望渲染的子组件
  children,
  // 当前路由页面的权限
  authority,
  // 权限不满足时，显示的页面组件
  noMatch = (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  ),
}) => {
  const childrenRender = typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);
  return <>{dom}</>;
};

export default Authorized;
