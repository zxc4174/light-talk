import * as React from "react"

import LightTalkContainer from "./container/LightTalkContainer"
import QueryPopover from "./components/QueryPopover"

const App: React.FC = () => {

  return (
    <LightTalkContainer>
      <QueryPopover />
    </LightTalkContainer>
  )
}

export default App