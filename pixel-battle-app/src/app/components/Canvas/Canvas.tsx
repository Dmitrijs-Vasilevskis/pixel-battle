"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalState } from "@/app/context/GlobalProvider";
import styled from "styled-components";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function CanvaComponent() {
  const {
    canvasRef,
    canvasContextRef,
    initializeCanvas,
    selectedColor,
    setIsShowCoordinates,
    setGridPixel,
    grid,
    drawGrid,
    scale,
    setScale,
    isDragging,
    setIsDragging,
    startX,
    setStartX,
    startY,
    setStartY,
    offsetX,
    setOffsetX,
    offsetY,
    setOffsetY,
    drawingArea,
    gridSize,
    setIsInitialized,
    setIsDataLoaded,
    isAloowedToPlace,
    setIsAllowedToPlace,
    setCooldown,
  } = useGlobalState();

  const canvasWith = window.innerWidth;
  const canvasHeight = window.innerHeight;

  const { user } = useUser();

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (!user) {
      toast.error("Authorization required");
      return;
    }

    const ctx = canvasContextRef.current;
    const canvas = canvasRef.current;

    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      let x = (e.clientX - rect.left - offsetX) / scale;
      let y = (e.clientY - rect.top - offsetY) / scale;

      if (
        x >= drawingArea.x &&
        x <= drawingArea.x + drawingArea.width &&
        y >= drawingArea.y &&
        y <= drawingArea.y + drawingArea.height
      ) {
        if (!isAloowedToPlace) {
          toast.error("Cooldown is not finished yet");
          return;
        }

        const col = Math.floor((x - drawingArea.x) / gridSize);
        const row = Math.floor((y - drawingArea.y) / gridSize);

        isPixelExist(row, col)
          ? setGridDataPixel({
              row,
              col,
              color: selectedColor.hex,
              update: true,
            })
          : setGridDataPixel({
              row,
              col,
              color: selectedColor.hex,
              update: false,
            });
      }
    }
  };

  const setGridDataPixel = async ({
    row,
    col,
    color,
    update,
  }: {
    row: number;
    col: number;
    color: string;
    update: boolean;
  }) => {
    const response = await fetch("/api/mongo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ row, col, color, update }),
    });

    if (response.status === 200) {
      setIsInitialized(false);
      setIsDataLoaded(false);
      setIsAllowedToPlace(false);
      setCooldown(60);
      toast.success("Pixel created successfully");
    } else {
      toast.error("Something went wrong creating the pixel");
    }
  };

  const isPixelExist = (row: number, col: number): boolean => {
    return grid[row]?.[col] !== undefined;
  };

  const handleMouseMove = (e: any) => {
    const ctx = canvasContextRef.current;
    const canvas = canvasRef.current;

    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setOffsetX((prev: number) => prev + dx);
      setOffsetY((prev: number) => prev + dy);
      setStartX(e.clientX);
      setStartY(e.clientY);

      drawGrid(grid);
    }

    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      let x = (e.clientX - rect.left - offsetX) / scale;
      let y = (e.clientY - rect.top - offsetY) / scale;

      if (
        x >= drawingArea.x &&
        x <= drawingArea.x + drawingArea.width &&
        y >= drawingArea.y &&
        y <= drawingArea.y + drawingArea.height
      ) {
        const col = Math.floor((x - drawingArea.x) / gridSize);
        const row = Math.floor((y - drawingArea.y) / gridSize);

        setGridPixel([col, row]);
        setIsShowCoordinates(true);
      } else {
        setIsShowCoordinates(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const onMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    const direction = e.deltaY > 0 ? -1 : 1; // Determine the direction of zoom

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newScale = Math.max(
        1,
        Math.min(scale + direction * zoomFactor, 10)
      );

      // Calculate the zoom delta
      const scaleDelta = newScale / scale;

      setOffsetX((prevOffsetX: number) => {
        return mouseX - (mouseX - prevOffsetX) * scaleDelta;
      });

      setOffsetY((prevOffsetY: number) => {
        return mouseY - (mouseY - prevOffsetY) * scaleDelta;
      });

      setScale(newScale);

      drawGrid(grid);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      initializeCanvas(canvas);
      canvas.addEventListener("wheel", onMouseWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", onMouseWheel);
      }
    };
  }, [canvasRef, scale, offsetX, offsetY]);

  return (
    <CanvasStyle
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      id="canvas"
      width={canvasWith}
      height={canvasHeight}
    ></CanvasStyle>
  );
}

const CanvasStyle = styled.canvas`
  touch-action: none;
  cursor: crosshair;
  background: #fff;
`;
