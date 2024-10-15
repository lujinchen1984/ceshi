import { Breadcrumb, Layout, Menu,Avatar } from 'antd';
import { DownOutlined, UserOutlined,DownloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Tooltip } from 'antd';
import DataView from '../../components/DataView';
import React from 'react';
import './index.css'
const { Header, Content, Footer } = Layout;

const handleMenuClick = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};
const items = [
  {
    label: '1st menu item',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: <UserOutlined />,
  },
];
const menuProps = {
  items,
  onClick: handleMenuClick,
};
const Mainpage = () => (
  <Layout className="layout">
    <Header  style={{ textAlign: 'left',height:'65px' }}>
      <Space>
        <div className="logo" />
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              车型
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              零件
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              阶段
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
      <div className="login">
        <Space>
          <Avatar
            style={{
              backgroundColor: '#87d068',
            }}
            icon={<UserOutlined />}
          />
          <Button type="primary" shape="round"  >
            Logoff
          </Button>
        </Space>
        
      </div>
    </Header>
    <Content>
        <DataView />
    </Content>
    <Footer
      style={{
        textAlign: 'center',
        height:'35px'
      }}
    >
      Design ©2018 Created by LJC
    </Footer>
  </Layout>
);
export default Mainpage;