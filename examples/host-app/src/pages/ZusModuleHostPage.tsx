import { Alert, Select, Spin } from 'antd';

import { useParams } from 'react-router-dom';
import { useZusModule } from 'zusloader-react';
import type { TAppMeta, TReactZusModule } from 'zusloader-react';
import ZusModuleRunner from '../integration/zusmodule/ZusModuleRunner';
import { useNavigateForMicroApp } from '../integration/zusmodule/hooks/useNavigateForMicroApp';
import { useMemo, useRef } from 'react';

const DEFAULT_MANIFEST_URL = 'http://localhost:3000/dist-zusmodule/manifest.json';
const PREFIX_PATH = '/zusmodule'

export default function ZusModuleHostPage() {
  const navigate = useNavigateForMicroApp()
  const rootDomRef = useRef<HTMLDivElement>(null)

  const { microAppKey: paramsAppKey, '*': pagePath } = useParams<{
    microAppKey?: string
    '*'?: string
  }>()

  const { isLoading, zusmodule, error } = useZusModule({
    zusmodule_manifest_url: DEFAULT_MANIFEST_URL
  });

  const microApp = useMemo(() => {
    if (!zusmodule?.microApps?.length) return

    if (paramsAppKey) {
      let foundMicroApp = zusmodule.microApps.find((app) => app.appKey === paramsAppKey)
      return foundMicroApp
    } else {
      return zusmodule.microApps[0] // 默认返回第一个应用
    }
  }, [zusmodule, paramsAppKey])

  const renderMicroAppSelectPanel = () => {
    if (!zusmodule) return null

    const handleMicroAppChange = (appKey: string) => {
      navigate(`${PREFIX_PATH}/${appKey}`)
    }

    const handlePageChange = (path: string) => {
      if (!microApp) return
      const splat = path.startsWith('/') ? path.slice(1) : path
      navigate(`${PREFIX_PATH}/${microApp.appKey}/${splat}`)
    }

    return (
      <MicroAppSelectPanel
        microAppKey={microApp?.appKey}
        microApp={microApp}
        pagePath={pagePath}
        onMicroAppChange={handleMicroAppChange}
        onPageChange={handlePageChange}
        zusmodule={zusmodule}
      />
    )
  }

  const renderContent = (): any => {
    if (isLoading) {
      return (
        <Spin style={{ height: '100%' }} spinning={true}></Spin>
      )
    }

    if (error) {
      return (
        <Alert type="error" title={error.message || "未知异常"} showIcon style={{ marginBottom: 16 }} />
      )
    }

    if (zusmodule && microApp) {
      return (
        <div
          className="zusmodule-mount-wrap"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 480,
            height: '70vh',
            border: '1px dashed #666',
          }}
        >
          <div
            ref={rootDomRef}
            style={{ flex: 1, minHeight: 0 }}
          />
          <ZusModuleRunner
            basePath={`${PREFIX_PATH}/${microApp.appKey}`}
            zusmodule={zusmodule}
            microApp={microApp}
            pagePath={pagePath}
            rootDomRef={rootDomRef}
          />
        </div>
      )
    }
  }

  return (
    <div>
      {renderMicroAppSelectPanel()}
      {renderContent()}
    </div>
  );
}

export function MicroAppSelectPanel({
  microAppKey,
  microApp,
  pagePath,
  onMicroAppChange,
  onPageChange,
  zusmodule,
}: {
  microAppKey?: string
  microApp?: TAppMeta
  pagePath?: string
  onMicroAppChange: (microAppKey: string) => void
  onPageChange: (path: string) => void
  zusmodule: TReactZusModule
}) {
  const microAppOptions =
    zusmodule.microApps.map((m) => ({
      label: `${m.displayName} (${m.appKey})`,
      value: m.appKey,
    }))

  const pageOptions =
    microApp?.pageList.map((p) => ({
      label: `${p.title} (${p.path})`,
      value: p.path,
    })) ?? []

  const currentPagePath = microApp
    ? (pagePath ? `/${pagePath}` : microApp.indexPagePath)
    : undefined

  return (
    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--ant-color-border)' }}>
      <span style={{ color: 'var(--ant-color-text-secondary)', marginRight: 12 }}>选择MicroApp: </span>
      <Select
        style={{ minWidth: 220 }}
        value={microAppKey}
        disabled={!zusmodule}
        options={microAppOptions}
        onChange={onMicroAppChange}
      />
      <span style={{ color: 'var(--ant-color-text-secondary)', marginLeft: 24, marginRight: 12 }}>选择页面: </span>
      <Select
        style={{ minWidth: 220 }}
        value={currentPagePath}
        disabled={!microApp || pageOptions.length === 0}
        options={pageOptions}
        onChange={onPageChange}
      />
    </div>
  )
}
