import React, { lazy, Suspense } from 'react'
import { Button } from 'antd'
import { useStore } from 'zustand/react'
import type { MicroAppControlSDK, MicroAppMeta } from '@xuqiyong666/zusloader'
import { MicroAppControlProvider, useMicroAppControl } from '@xuqiyong666/zusloader-react'

import SampleApp1Page1 from './page1'
import SampleApp1Page2 from './page2'

export interface SampleApp1Props {
  control: MicroAppControlSDK
  microApp: MicroAppMeta
}

export function SampleApp1({ control, microApp }: SampleApp1Props) {
  return (
    <MicroAppControlProvider control={control}>
      <SampleApp1Content microApp={microApp} />
    </MicroAppControlProvider>
  )
}

function SampleApp1Content({ microApp }: { microApp: MicroAppMeta }) {
  const { store, actions } = useMicroAppControl()
  const pagePath = useStore(store, (s) => s.router.path)
  const pageParams = useStore(store, (s) => s.router.params)
  const basePath = useStore(store, (s) => s.basePath)

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 12,
          padding: 12,
          backgroundColor: '#eeeeee',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
          <span>Layout公共区域:</span>
          <Button type="primary" onClick={() => actions.navigate('/page1', {})}>
            Page1
          </Button>
          <Button type="primary" onClick={() => actions.navigate('/page2', {})}>
            Page2
          </Button>
          <Button
            type="primary"
            onClick={() =>
              actions.navigate('/page2', { from: 'demo', tab: 'settings' })
            }
          >
            Page2 (带参数示例)
          </Button>
          <Button
            type="primary"
            onClick={() => actions.navigate(microApp.indexPagePath)}
          >
            回到首页 (indexPageId)
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
          basePath: {basePath}
        </div>
      </nav>
      {pagePath === '/page1' ? (
        <SampleApp1Page1 />
      ) : pagePath === '/page2' ? (
        <SampleApp1Page2 />
      ) : (
        <div>Unknown pagePath: {pagePath}</div>
      )}
    </div>
  )
}
