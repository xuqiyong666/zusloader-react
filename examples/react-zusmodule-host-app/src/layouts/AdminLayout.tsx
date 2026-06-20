import { AppstoreOutlined, DashboardOutlined } from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const SIDER_WIDTH = 220

type MenuItemMeta = {
  key: string
  icon: ReactNode
  label: string
  type: 'host' | 'module'
  moduleKey?: string
  modulePath?: string
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const menuItems = useMemo(
    (): MenuItemMeta[] => [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '工作台',
        type: 'host',
      },
      {
        key: '/zusmodule',
        icon: <AppstoreOutlined />,
        label: '远程子模块',
        type: 'host',
      },
    ],
    []
  )

  const selectedKey = useMemo(() => {
    const path = location.pathname
    const hit = menuItems.find((item) => path.startsWith(item.key))
    return hit?.key ?? '/dashboard'
  }, [location.pathname, menuItems])

  const antMenuItems = useMemo<MenuProps['items']>(
    () =>
      menuItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      })),
    [menuItems]
  )

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={64}
        width={SIDER_WIDTH}
        style={{
          background: token.colorBgContainer,
          borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 15,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          React Host
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={antMenuItems}
          style={{ borderInlineEnd: 0, marginTop: 8 }}
          onClick={({ key }) => {
            const item = menuItems.find((x) => x.key === key)
            if (!item) {
              return
            }

            navigate(item.key)
          }}
        />
      </Sider>
      <Layout style={{ flex: 1, minHeight: 0 }}>
        <Header
          style={{
            paddingInline: token.paddingLG,
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            lineHeight: '64px',
            height: 64,
            flexShrink: 0,
          }}
        >
          主应用 · 宿主
        </Header>
        <Content
          style={{
            margin: token.marginLG,
            padding: token.paddingLG,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
