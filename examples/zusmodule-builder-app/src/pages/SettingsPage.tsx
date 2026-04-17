import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function SettingsPage() {
  return (
    <Typography>
      <Title level={4} style={{ marginTop: 0 }}>
        设置页
      </Title>
      <Paragraph type="secondary">维护子模块级别的配置。</Paragraph>
    </Typography>
  )
}
