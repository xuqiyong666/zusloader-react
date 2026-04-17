import { Alert, Select, Spin } from 'antd';

import { useParams } from 'react-router-dom';
import { useZusModule } from '@xuqiyong666/zusloader-react';
import type { ZusModule } from '@xuqiyong666/zusloader';
import ZusModuleRunner from '../integration/zusmodule/ZusModuleRunner';
import { useNavigateForMicroApp } from '../integration/zusmodule/hooks/useNavigateForMicroApp';
import { useMemo, useRef } from 'react';

const DEFAULT_MANIFEST_URL = 'http://localhost:3000/manifest.json';
const PREFIX_PATH = '/zus-module'

export default function ZusModuleHostPage() {
  const navigate = useNavigateForMicroApp()
  const rootDomRef = useRef<HTMLDivElement>(null)

  const { microAppKey: paramsAppKey, '*': pagePath } = useParams<{
    microAppKey?: string
    '*'?: string
  }>()


  const { status, zusmodule, errorMessage } = useZusModule({
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
      const appPath = `/${PREFIX_PATH}/${appKey}`
      navigate(appPath)
    }

    return (
      <MicroAppSelectPanel
        microAppKey={microApp?.appKey}
        onChange={handleMicroAppChange}
        zusmodule={zusmodule}
      />
    )
  }

  const renderContent = (): any => {
    if (status === 'loading') {
      return (
        <Spin style={{ height: '100%' }} spinning={true}></Spin>
      )
    }

    if (status === 'error') {
      return (
        <Alert type="error" message={errorMessage || "未知异常"} showIcon style={{ marginBottom: 16 }} />
      )
    }

    if (zusmodule && microApp) {
      return (
        <div style={{ border: '1px dashed #666' }}>
          <div
            ref={rootDomRef}
            style={{ height: '100%' }}
          />
          <ZusModuleRunner basePath={`${PREFIX_PATH}/${microApp?.appKey}`}
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
  onChange,
  zusmodule,
}: {
  microAppKey: string,
  onChange: (microAppKey: string) => void,
  zusmodule: ZusModule,
}) {

  const microAppOptions =
    zusmodule?.microApps.map((m) => ({
      label: `${m.displayName} (${m.appKey})`,
      value: m.appKey,
    })) ?? []

  return (
    <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--ant-color-border)' }}>
      <span style={{ color: 'var(--ant-color-text-secondary)', marginRight: 12 }}>选择MicroApp: </span>
      <Select
        style={{ minWidth: 220 }}
        value={microAppKey}
        disabled={!zusmodule}
        options={microAppOptions}
        onChange={onChange}
      />
    </div>
  )
}
