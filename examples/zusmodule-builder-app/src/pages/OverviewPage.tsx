import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function OverviewPage() {
  return (
    <Typography>
      <Title level={4} style={{ marginTop: 0 }}>
        概览页
      </Title>
      <Paragraph type="secondary">子模块的业务总览页面。</Paragraph>
    </Typography>
  )
}
