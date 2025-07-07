import * as React from 'react'
import CollapseIcon from '../../shared/icons/CollapseIcon'
import ExpandIcon from '../../shared/icons/ExpandIcon'
import Tooltip from './Tooltip'

interface ExpandButtonProps {
    isExpand: boolean
    onClick: (value) => void
}

const ExpandButton: React.FC<ExpandButtonProps> = ({
    isExpand,
    onClick
}) => {
    const handleOnClick = () => {
        onClick?.(isExpand ? 'expand' : 'collapse')
    }
    return (
        <Tooltip title={isExpand ? 'Collapse window' : 'Expand window'} deps={[isExpand]}>
            <button
                className="--light-talk__popover__action-button --light-talk__popover__action-button__expand"
                onClick={handleOnClick}
            >
                {isExpand ? <CollapseIcon /> : <ExpandIcon />}
            </button>
        </Tooltip>
    )
}

export default ExpandButton