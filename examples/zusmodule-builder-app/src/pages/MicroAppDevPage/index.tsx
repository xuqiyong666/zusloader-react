import { LeftOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, theme, Typography } from 'antd'
import { useEffect, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand/react'

import { getMicroAppByKey } from '../../metadata.ts'

import type { MicroAppControlActions, MicroAppControlSDK, MicroAppControlState, MicroAppPageMeta, MicroAppStatus } from '@xuqiyong666/zusloader'
import {
  MicroAppControlProvider,
  useMicroAppControl,
} from '@xuqiyong666/zusloader-react'

import { MicroAppDevContentPanel } from './MicroAppDevContentPanel.tsx'
import { useStateRef } from '../../hooks/useStateRef.ts'
import { useNavigateForMicroApp } from '../../hooks/useNavigateForMicroApp.ts'

const { Header, Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography

function DevSiderMenu({ pageList }: { pageList: MicroAppPageMeta[] }) {
  const { store, actions } = useMicroAppControl()
  const pagePath = useStore(store, (s) => s.router.path)

  const menuItems = useMemo(() => {
    return pageList.map((p) => ({
      key: p.path,
      label: p.title,
      path: p.path
    }))
  }, [pageList])

  return (
    <Menu
      mode="inline"
      selectedKeys={[pagePath]}
      items={menuItems}
      style={{ borderInlineEnd: 0 }}
      onClick={({ key }) => actions.navigate(String(key))}
    />
  )
}

/**
 * MicroApp 本地开发调试壳：顶栏 + 侧栏 + zustand 路由 store + MicroApp 挂载。
 * 侧栏单独包一层 MicroAppControlContext.Provider；MicroApp 根组件内再包一层（同一 router）。
 */
export function MicroAppDevPage() {
  const { appKey, pagePath } = useParams<{ appKey: string; pagePath?: string }>()
  const location = useLocation()

  const navigate = useNavigateForMicroApp()

  const microApp = useMemo(() => getMicroAppByKey(appKey), [appKey])
  const { token } = theme.useToken()

  const basePath = useMemo(() => `/dev/${appKey}`, [appKey])

  const control = useMemo(() => {
    if (!microApp) {
      return null
    }

    const store = createStore<MicroAppControlState>(() => ({
      router: {
        path: microApp.indexPagePath,
        params: {},
      },
      basePath,
      status: 'idle' as const
    }))

    const hostNavigate = (nextPath, nextParams = {}) => {
      navigate(nextPath, nextParams)
    }
    const navigateInApp = (nextPath, nextParams = {}) => {
      const normalizedPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
      navigate(`${basePath}${normalizedPath}`, nextParams)
    }
    const setStatus = (status: MicroAppStatus) => {
      store.setState((s) => ({ ...s, status }))
    }
    const setErrorMsg = (message) => {
      store.setState((s) => ({ ...s, errorMsg: message }))
    }
    const control: MicroAppControlSDK = {
      store,
      actions: {
        hostNavigate,
        navigate: navigateInApp,
        setStatus,
        setErrorMsg,
      },
    }

    return control
  }, [microApp, navigate, basePath])

  useEffect(() => {
    if (!microApp || !control) {
      return
    }

    const searchParams = new URLSearchParams(location.search)
    const nextPathRaw = pagePath ? `/${pagePath}` : microApp.indexPagePath
    const nextPath = nextPathRaw.startsWith('/') ? nextPathRaw : `/${nextPathRaw}`
    const nextParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      nextParams[key] = value
    })
    control.store.setState({ router: { path: nextPath, params: nextParams } })
  }, [location.search, microApp, navigate, pagePath, control])

  if (!microApp) {
    return (
      <div style={{ padding: 48 }}>
        <Title level={4}>未找到 MicroApp</Title>
        <Paragraph type="secondary">
          appKey <Text code>{appKey}</Text> 未在 manifest 中登记。
        </Paragraph>
        <Link to="/">返回首页</Link>
      </div>
    )
  }

  if (!control) {
    return null
  }

  return (
    <MicroAppControlProvider control={control}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            paddingInline: token.paddingLG,
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Link to="/">
            <Button type="text" icon={<LeftOutlined />}>
              返回首页
            </Button>
          </Link>
          <Title level={5} style={{ margin: 0, flex: 1 }}>
            MicroApp 调试 — {microApp.displayName}
          </Title>
          <Text type="secondary">
            <Text code>{microApp.appKey}</Text>
          </Text>
        </Header>
        <Layout>
          <Sider
            width={220}
            theme="light"
            style={{
              background: token.colorBgContainer,
              borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                fontWeight: 600,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              页面列表
            </div>
            <DevSiderMenu pageList={microApp.pageList} />
          </Sider>
          <Content
            style={{ padding: token.paddingLG, background: token.colorFillAlter }}
          >
            <div
              style={{
                padding: token.paddingLG,
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                minHeight: 360,
              }}
            >
              <MicroAppDevContentPanel microApp={microApp} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </MicroAppControlProvider>
  )
}
