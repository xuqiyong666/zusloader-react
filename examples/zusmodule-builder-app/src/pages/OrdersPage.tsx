import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function OrdersPage() {
  return (
    <Typography>
      <Title level={4} style={{ marginTop: 0 }}>
        订单页
      </Title>
      <Paragraph type="secondary">展示订单相关信息。</Paragraph>
    </Typography>
  )
}
