import './ScrollColumn.css' // we'll create this next
import { Title } from './Title'

type Props = {
    items: string[]
    direction?: 'up' | 'down'
}

export const ScrollColumn = ({ items, direction = 'down' }: Props) => {
    const isUp = direction === 'up'
    const animationClass = isUp ? 'scroll-up' : 'scroll-down'

    return (
        <div className="scroll-container">
            <div className={`scroll-content ${animationClass}`}>
                {[...items, ...items].map((item: any, index) => (
                    <Title key={`${item.show_id}-${index}`} title={item} full={false} />
                ))}
            </div>
        </div>
    )
}