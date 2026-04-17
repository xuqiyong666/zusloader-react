
import { Button } from "antd"
import { useMicroAppControl } from "@xuqiyong666/zusloader-react"
import { useStore } from "zustand"

export const SampleApp1Page2 = () => {

  const { actions, store } = useMicroAppControl()

  const pageParams = useStore(store, (state) => state.router.params || {})

  return (
    <div>
      <h1>SampleApp1 - Page2</h1>
      <div>
        <Button type="primary" onClick={() => actions.navigate('/page1')}>
          跳转Page1
        </Button>
      </div>
      {Object.keys(pageParams).length > 0 ? (
        <pre style={{ fontSize: 12 }}>{JSON.stringify(pageParams, null, 2)}</pre>
      ) : null}
    </div>
  )
}

export default SampleApp1Page2
