import { AppstoreOutlined } from '@ant-design/icons'
import { Card, List, Typography } from 'antd'
import { Link } from 'react-router-dom'

import { microApps } from '../metadata.ts'

const { Title, Paragraph, Text } = Typography

export function HomePage() {
  return (
    <div style={{ maxWidth: 880, margin: '40px auto', padding: '0 24px' }}>
      <Title level={3} style={{ marginTop: 0 }}>
        MicroApp 列表
      </Title>
      <Paragraph type="secondary">
        选择一项进入该 MicroApp 的开发调试页（antd 后台 Layout + 侧栏 page key 菜单）。
      </Paragraph>
      <List
        dataSource={microApps}
        renderItem={(item) => (
          <List.Item style={{ paddingInline: 0 }}>
            <Card
              size="small"
              style={{ width: '100%' }}
              title={
                <span>
                  <AppstoreOutlined style={{ marginRight: 8 }} />
                  {item.displayName}
                </span>
              }
              extra={
                <Link to={`/dev/${item.appKey}`}>进入调试</Link>
              }
            >
              <Paragraph style={{ marginBottom: 8 }}>
                <Text type="secondary">appKey</Text> <Text code>{item.appKey}</Text>
              </Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>
                <Text type="secondary">indexPagePath</Text>{' '}
                <Text code>{item.indexPagePath}</Text>
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }}>
                <Text type="secondary">pageList</Text>{' '}
                <Text code>
                  [{item.pageList.map((p) => p.path).join(', ')}]
                </Text>
              </Paragraph>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}
