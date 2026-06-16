import React, { lazy, Suspense } from 'react'
import { Button } from 'antd'
import { useStore } from 'zustand/react'
import type { TAppMeta, TReactControlSDK } from 'zusloader-react'
import { MicroAppControlProvider, useMicroAppControl } from 'zusloader-react'

import SampleApp2Page1 from './page1'
import SampleApp2Page2 from './page2'

export interface SampleApp2Props {
  control: TReactControlSDK
  microApp: TAppMeta
}

export function SampleApp2({ control, microApp }: SampleApp2Props) {
  return (
    <MicroAppControlProvider control={control}>
      <SampleApp2Content microApp={microApp} />
    </MicroAppControlProvider>
  )
}

function SampleApp2Content({ microApp }: { microApp: TAppMeta }) {
  const { store, actions } = useMicroAppControl()
  const pagePath = useStore(store, (s) => s.router.path)
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
          <Button type="primary" onClick={() => actions.navigate('page1', {})}>
            Page1
          </Button>
          <Button type="primary" onClick={() => actions.navigate('page2', {})}>
            Page2
          </Button>
          <Button
            type="primary"
            onClick={() =>
              actions.navigate('page2', { from: 'demo', tab: 'settings' })
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
        <SampleApp2Page1 />
      ) : pagePath === '/page2' ? (
        <SampleApp2Page2 />
      ) : (
        <div>Unknown pagePath: {pagePath}</div>
      )}
    </div>
  )
}
