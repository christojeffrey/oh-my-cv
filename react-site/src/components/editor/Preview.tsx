import { useState } from 'react'
import { useAtom } from 'jotai'
import { cvDataAtom, styleAtom } from '@/atoms'
import { Markdown } from '@/components/shared/Markdown'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize2, Maximize } from 'lucide-react'

export function Preview() {
  const [cvData] = useAtom(cvDataAtom)
  const [styles] = useAtom(styleAtom)
  const [scale, setScale] = useState(1)

  const zoomIn = () => setScale(prev => prev * 1.1)
  const zoomOut = () => setScale(prev => prev / 1.1)
  const fitWidth = () => setScale(0.8) // Basic fit
  const fitHeight = () => setScale(0.6) // Basic fit

  return (
    <div className="relative h-full bg-secondary border-4 border-secondary overflow-hidden">
      <div
        className="h-full overflow-auto"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        <div className="bg-white dark:bg-gray-900 p-8 min-h-full shadow-lg">
          <Markdown content={cvData.markdown || '# Your Resume\n\nWrite your markdown here...'} />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-blue-500 text-white rounded-full shadow-lg flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          className="text-white hover:bg-blue-600 p-2"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          className="text-white hover:bg-blue-600 p-2"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={fitWidth}
          className="text-white hover:bg-blue-600 p-2"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={fitHeight}
          className="text-white hover:bg-blue-600 p-2"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}