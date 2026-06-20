import { useMemo, useRef } from 'react'
import { Alert, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { Box, Center, Flex, VStack } from 'chakbox-ui'
import { useZusModule } from 'zusloader-react'

import ZusModuleRunner from '../../integration/zusmodule/ZusModuleRunner'
import { useNavigateForMicroApp } from '../../integration/zusmodule/hooks/useNavigateForMicroApp'
import MicroAppSelectDock from './components/MicroAppSelectDock'
import {
  DEFAULT_MANIFEST_URL,
  PREFIX_PATH,
  isMicroAppHostDevDockEnabled,
} from './constants'

export default function ZusModuleHostPage() {
  const navigate = useNavigateForMicroApp()
  const rootDomRef = useRef<HTMLDivElement>(null)

  const { microAppKey: paramsAppKey, '*': pagePath } = useParams<{
    microAppKey?: string
    '*'?: string
  }>()

  const { isLoading, zusmodule, error } = useZusModule({
    zusmodule_manifest_url: DEFAULT_MANIFEST_URL,
  })

  const microApp = useMemo(() => {
    if (!zusmodule?.microApps?.length) {
      return undefined
    }

    if (paramsAppKey) {
      return zusmodule.microApps.find((app) => app.appKey === paramsAppKey)
    }

    return zusmodule.microApps[0]
  }, [zusmodule, paramsAppKey])

  const handleMicroAppChange = (appKey: string) => {
    const nextMicroApp = zusmodule?.microApps.find((app) => app.appKey === appKey)
    const indexSplat = nextMicroApp?.indexPagePath.replace(/^\//, '') ?? ''
    if (indexSplat) {
      navigate(`${PREFIX_PATH}/${appKey}/${indexSplat}`)
      return
    }
    navigate(`${PREFIX_PATH}/${appKey}`)
  }

  const handlePageChange = (path: string) => {
    if (!microApp) {
      return
    }
    const splat = path.startsWith('/') ? path.slice(1) : path
    navigate(`${PREFIX_PATH}/${microApp.appKey}/${splat}`)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center flex={1} minH={200}>
          <Spin spinning />
        </Center>
      )
    }

    if (error) {
      return (
        <Box mb={16}>
          <Alert type="error" title={error.message || '未知异常'} showIcon />
        </Box>
      )
    }

    if (zusmodule && paramsAppKey && !microApp) {
      return (
        <Box mb={16}>
          <Alert
            type="error"
            title={`MicroApp 未找到: appKey「${paramsAppKey}」不存在`}
            showIcon
          />
        </Box>
      )
    }

    if (zusmodule && microApp) {
      return (
        <Flex direction="column" flex={1} minH={0}>
          <Box ref={rootDomRef} flex={1} minH={0} />
          <ZusModuleRunner
            basePath={`${PREFIX_PATH}/${microApp.appKey}`}
            zusmodule={zusmodule}
            microApp={microApp}
            pagePath={pagePath}
            rootDomRef={rootDomRef}
          />
        </Flex>
      )
    }

    return null
  }

  return (
    <VStack align="stretch" h="100%" minH="100%">
      {renderContent()}
      {zusmodule && isMicroAppHostDevDockEnabled() ? (
        <MicroAppSelectDock
          microAppKey={microApp?.appKey}
          microApp={microApp}
          pagePath={pagePath}
          onMicroAppChange={handleMicroAppChange}
          onPageChange={handlePageChange}
          zusmodule={zusmodule}
        />
      ) : null}
    </VStack>
  )
}
