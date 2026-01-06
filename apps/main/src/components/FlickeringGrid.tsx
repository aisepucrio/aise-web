"use client";

import React, { useEffect, useRef, useMemo } from "react";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(255, 255, 255)",
  width,
  height,
  className,
  maxOpacity = 0.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string) => {
      if (typeof window === "undefined") {
        return `rgba(255, 255, 255, ${maxOpacity})`;
      }
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return `rgba(255, 255, 255, ${maxOpacity})`;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b}, ${maxOpacity})`;
    };
    return toRGBA(color);
  }, [color, maxOpacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // largura/altura atuais do canvas
    let w = 0;
    let h = 0;
    // número de colunas/linhas do grid
    let cols = 0;
    let rows = 0;
    // intensidades dos quadrados
    let squares = new Float32Array(0);

    // (re)cria o grid baseado no tamanho atual
    const setupGrid = () => {
      cols = Math.floor(w / (squareSize + gridGap));
      rows = Math.floor(h / (squareSize + gridGap));

      const total = Math.max(cols * rows, 0);
      squares = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
    };

    const resize = () => {
      // se width/height forem passados, eles mandam; senão usa o container
      w = width ?? container.offsetWidth;
      h = height ?? container.offsetHeight;

      canvas.width = w;
      canvas.height = h;

      setupGrid();
    };

    // primeira configuração
    resize();

    // resize global de janela (zoom, mudanças mais bruscas)
    window.addEventListener("resize", resize);

    // observa mudanças de tamanho específicas do container (layout, altura por conteúdo)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && !width && !height) {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(container);
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = memoizedColor;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const index = i * rows + j;
          if (index >= squares.length) continue;

          if (Math.random() < flickerChance) {
            squares[index] = Math.random() * maxOpacity;
          }

          ctx.globalAlpha = squares[index];
          ctx.fillRect(
            i * (squareSize + gridGap),
            j * (squareSize + gridGap),
            squareSize,
            squareSize
          );
        }
      }

      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener("resize", resize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    squareSize,
    gridGap,
    flickerChance,
    memoizedColor,
    width,
    height,
    maxOpacity,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default FlickeringGrid;
