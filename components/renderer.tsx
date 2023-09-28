import { ResizeSensor, Spinner } from "@blueprintjs/core"
import clsx from "clsx"
import type { KonvaEventObject } from "konva/lib/Node"
import { nanoid } from "nanoid"
import { Fragment, useEffect, useRef, useState } from "react"
import { Stage, Layer, Rect, Circle } from "react-konva"
import "react-before-after-slider-component/dist/build.css"

export interface Anchor {
  /**
   * X position in viewport coordinates.
   */
  x: number;
  /**
   * Y position in viewport coordinates.
   */
  y: number;
}

export interface Roi {
  /**
   * Identifier.
   */
  uid: string;
  /**
   * Min point x coordinate in viewport coordinates.
   */
  x: number;
  /**
   * Min point y coordinate in viewport coordinates.
   */
  y: number;
  /**
   * Width in viewport coordinates.
   */
  width: number;
  /**
   * Height in viewport coordinates.
  */
  height: number;
  /**
   * Placement anchor.
   */
  anchor?: Anchor;
}

export interface RoiRendererProps {
  image?: string;
  rois?: Roi[];
  loading?: number;
  onUpdateRoi?: (roi: Roi) => void;
  onSelectRoi?: (id: string) => void;
  activeRoiId?: string;
  className?: string;
}

export default function RoiRenderer ({ image, rois: initialRois, loading, onSelectRoi, onUpdateRoi, activeRoiId, className }: RoiRendererProps) {
  const [size, setSize] = useState<[width: number, height: number]>([0, 0]);
  const [rois, setRois] = useState<Roi[]>(initialRois ?? []);
  const [currentRoi, setCurrentRoi] = useState<Roi>(null);
  const [dashOffset, setDashOffset] = useState(0);
  const [hoverRois, _] = useState<Set<string>>(new Set<string>());
  // Update rois
  useEffect(() => setRois(initialRois), [initialRois]);
  // Set size
  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth)
      setSize([divRef.current.offsetWidth, divRef.current.offsetHeight])
  }, []);
  // Dash offset
  useEffect(() => {
    const timerId = setInterval(() => setDashOffset(prev => prev + 0.25), 10);
    return () => clearInterval(timerId);
  }, []);
  // Handlers
  const onMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    // Check current
    if (currentRoi)
      return;
    // Check hover
    if (hoverRois.size > 0)
      return;
    // Start roi
    const uid = nanoid();
    const { x: px, y: py } = event.target.getStage().getPointerPosition();
    const x = px / size[0];
    const y = py / size[1];
    setCurrentRoi({ uid, x, y, width: 0, height: 0 });
  };
  const onMouseUp = (event: KonvaEventObject<MouseEvent>) => {
    // Check
    if (!currentRoi)
      return;
    // Check roi valid
    if (isValidViewportRoi(currentRoi)) {
      const updatedRois = [...rois, currentRoi];
      setRois(updatedRois);
      onUpdateRoi?.(currentRoi);
    }
    // Invalidate current
    setCurrentRoi(null);
  };
  const onMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (!currentRoi)
      return;
    const { uid, x: sx, y: sy } = currentRoi;
    const { x: px, y: py } = event.target.getStage().getPointerPosition();
    const x = px / size[0];
    const y = py / size[1];
    setCurrentRoi({ uid, x: sx, y: sy, width: x - sx, height: y - sy });
  };
  // Render
  return (
    <ResizeSensor targetRef={divRef} onResize={e => setSize([e[0].contentRect.width, e[0].contentRect.height])}>
      <div ref={divRef} className={clsx("relative h-fit", className)}>
        <img
          src={image}
          className={clsx("object-contain", loading !== undefined ? "blur brightness-[0.4]" : "")}
        />
        {
          loading !== undefined &&
          <div className="absolute top-0 w-full h-full flex flex-col justify-center">
            <Spinner size={80} value={loading} intent="primary" />
          </div>
        }
        {
          loading === undefined &&
          <Stage
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            width={size[0]}
            height={size[1]}
            onClick={() => onSelectRoi?.(rois.find(r => r.uid === hoverRois.values().next().value)?.uid)}
            className="absolute top-0 w-full h-full"
          >
            <Layer>
              {[...rois, ...(currentRoi ? [currentRoi] : [])].map(r => viewportToScreenRoi(r, size)).filter(isScreenRoiBigEnough).map((roi, idx) => 
                <Fragment key={roi.uid}>
                  <Rect
                    x={roi.x}
                    y={roi.y}
                    width={roi.width}
                    height={roi.height}
                    draggable
                    cornerRadius={Math.min(roi.width * size[0], roi.height * size[1], 5)}
                    fill={roi.uid === activeRoiId ? "#111827A0" : hoverRois.has(roi.uid) ? "#11182758" : "#11182740"}
                    stroke={isValidScreenRoi(roi) ? "white" : "red"}
                    strokeWidth={1}
                    dash={isValidScreenRoi(roi) ? [10, 12] : null}
                    dashOffset={idx % 2 ? dashOffset : -dashOffset}
                    onMouseEnter={() => hoverRois.add(roi.uid)}
                    onMouseLeave={() => hoverRois.delete(roi.uid)}
                    onDragEnd={e => onUpdateRoi({
                      ...roi,
                      x: e.target.x() / size[0],
                      y: e.target.y() / size[1],
                      width: e.target.width() / size[0],
                      height: e.target.height() / size[1]
                    })}
                  />
                  {
                    roi.anchor && roi.uid === activeRoiId &&
                    <Circle
                      x={roi.anchor.x * size[0]}
                      y={roi.anchor.y * size[1]}
                      radius={15}
                      fill="#ffffff"
                      draggable
                      onDragEnd={e => onUpdateRoi({
                        ...rois.find(r => r.uid === roi.uid),
                        anchor: { x: e.target.x() / size[0], y: e.target.y() / size[1] } 
                      })}
                    />
                  }
                </Fragment>
              )}
            </Layer>
          </Stage>
        }
      </div>
    </ResizeSensor>
  );
}

function viewportToScreenRoi (roi: Roi, size: [number, number]): Roi {
  const { x: ax, y: ay, width, height, ...rest } = roi;
  const bx = ax + width;
  const by = ay + height;
  const xMin = size[0] * Math.min(ax, bx);
  const yMin = size[1] * Math.min(ay, by);
  const xMax = size[0] * Math.max(ax, bx);
  const yMax = size[1] * Math.max(ay, by);
  return { ...rest, x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
}

function isScreenRoiBigEnough ({ width, height }: Roi) {
  return width * height > 10;
}

function isValidViewportRoi ({ width, height }: Roi): boolean {
  return width > 0.025 && height > 0.025;
}

function isValidScreenRoi ({ width, height }: Roi): boolean {
  return width > 10 && height > 10;
}