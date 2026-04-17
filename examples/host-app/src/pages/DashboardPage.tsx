import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export function DashboardPage() {
  return (
    <Typography>
      <Title level={4} style={{ marginTop: 0 }}>
        工作台
      </Title>
      <Paragraph type="secondary">
        宿主应用总览。后续可在此接入用户摘要、子应用入口与系统状态。
      </Paragraph>
    </Typography>
  )
}
