import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { cvDataAtom, resumeStyleAtom } from '@/atoms'
import { Markdown } from '@/components/shared/Markdown'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize2, Maximize } from 'lucide-react'
import { injectCss } from '@/utils/dynamic-css'

export function Preview() {
  const [cvData] = useAtom(cvDataAtom)
  const [style] = useAtom(resumeStyleAtom)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // Inject the resume CSS on component mount
    injectCss('resume-editor', cvData.css);

    // Apply dynamic styles based on customization settings
    const styleElement = document.getElementById('dynamic-styles')
    if (styleElement && style) {
      styleElement.textContent = `
        .resume-preview {
          margin: ${style.marginV || 50}px ${style.marginH || 45}px;
          line-height: ${style.lineHeight || 1.3};
          font-size: ${style.fontSize || 15}px;
        }
        .resume-preview h2,
        .resume-preview h3 {
          margin-bottom: ${style.paragraphSpace || 5}px;
        }
        .resume-preview .resume-header h1 {
          color: ${style.themeColor || '#377bb5'};
          margin-bottom: 20px;
          text-align: center;
        }
        .resume-preview .resume-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .resume-preview .resume-header-item:not(.no-separator)::after {
          content: " | ";
          margin: 0 8px;
        }
        .resume-preview h2 {
          border-bottom: 1px solid ${style.themeColor || '#377bb5'};
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .resume-preview h3 {
          margin-top: 20px;
        }
        .resume-preview ul {
          list-style-type: circle;
          padding-left: 20px;
        }
        .resume-preview ol {
          list-style-type: decimal;
          padding-left: 20px;
        }
        .resume-preview li {
          margin-bottom: 5px;
        }
        .resume-preview p {
          margin-bottom: 10px;
        }
        .resume-preview strong {
          font-weight: bold;
        }
        .resume-preview em {
          font-style: italic;
        }
      `
    }

    // Cleanup function
    return () => {
      // Don't remove CSS on unmount as it might be needed elsewhere
    }
  }, [cvData.css, style])

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
        <div
          className="bg-white dark:bg-gray-900 p-8 min-h-full shadow-lg resume-preview"
          style={{
            fontFamily: style?.fontEN?.name || 'Arial, sans-serif'
          }}
        >
          <style id="dynamic-styles"></style>
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