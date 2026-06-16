
import { Button } from "antd"
import { useMicroAppControl } from "zusloader-react"
import { useStore } from "zustand"

export const SampleApp2Page1 = () => {

  const { actions, store } = useMicroAppControl()

  const pageParams = useStore(store, (state) => state.router.params || {})

  return (
    <div>
      <h1>SampleApp2 - Page1</h1>
      <div>
        <Button type="primary" onClick={() => actions.navigate('/page2')}>
          跳转Page2
        </Button>
      </div>
      {Object.keys(pageParams).length > 0 ? (
        <pre style={{ fontSize: 12 }}>{JSON.stringify(pageParams, null, 2)}</pre>
      ) : null}
    </div>
  )
}

export default SampleApp2Page1
