import { Alert, Button, Typography } from 'antd'

const { Title, Paragraph, Text } = Typography

interface Props {
  title?: string
  message: string
  /** 放弃本地 path 选择，重新以 `getModuleRoute` 快照为准（宿主修正后可点） */
  onRetryReadSnapshot?: () => void
}

/**
 * 仅本地开发：当 zusloader 路由快照或导航 intent 的 path 无效时展示，便于排查桥接/注册顺序问题。
 */
export function DevRouteErrorPage({
  title = '开发态路由错误',
  message,
  onRetryReadSnapshot,
}: Props) {
  return (
    <div style={{ maxWidth: 640, margin: '48px auto', padding: 24 }}>
      <Typography>
        <Title level={4}>{title}</Title>
        <Paragraph type="secondary">
          本页仅在子模块本地开发时出现；发布态应由宿主保证合法导航与快照。
        </Paragraph>
        <Alert type="error" showIcon message={<Text code>{message}</Text>} />
        {onRetryReadSnapshot ? (
          <Paragraph style={{ marginTop: 16 }}>
            <Button type="primary" onClick={onRetryReadSnapshot}>
              重新读取宿主路由快照
            </Button>
          </Paragraph>
        ) : null}
      </Typography>
    </div>
  )
}
