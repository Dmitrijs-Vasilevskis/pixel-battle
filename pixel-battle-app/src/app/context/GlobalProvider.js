"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { defaultPalette } from "./defaulPallete";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import themes from "../utils/theme";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
  const drawingArea = { x: 250, y: 250, width: 300, height: 300 };
  const gridSize = 2;
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [gridPixel, setGridPixel] = useState([0, 0]);
  const [cooldown, setCooldown] = useState(0);
  const [isAloowedToPlace, setIsAllowedToPlace] = useState(true);

  const [selectedTheme, setSelectedTheme] = useState(0);
  const theme = themes[selectedTheme];
  const { user } = useUser();

  const [grid, setGrid] = useState(() => {
    const rows = drawingArea.width / gridSize;
    const cols = drawingArea.height / gridSize;
    const initialGrid = Array.from({ length: rows }, () =>
      Array(cols).fill(null)
    );
    return initialGrid;
  });

  const canvasRef = useRef();
  const canvasContextRef = useRef();
  const [paletteColors, setPaletteColors] = useState(defaultPalette);
  const [selectedColor, setSelectedColor] = useState(defaultPalette[0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isShowCoordinates, setIsShowCoordinates] = useState(false);

  const initializeCanvas = (canvas) => {
    if (isInitialized) return;

    canvasRef.current = canvas;
    canvasContextRef.current = canvas.getContext("2d");

    if (canvasRef) {
      getCanvasDataMongoDb();
      drawGrid(grid);
    }
  };

  const getCanvasDataMongoDb = async () => {
    if (isDataLoaded) return;

    const response = await fetch("/api/mongo")
      .then((response) => {
        response.json().then((response) => {
          if (response) {
            setIsDataLoaded(true);
            const newGrid = [...grid];

            response.forEach((pixel) => {
              newGrid[pixel.x][pixel.y] = pixel.color;
            });

            setGrid(newGrid);
            setIsInitialized(true);

            drawGrid(newGrid);
          } else {
            toast.error("Something went wrong loading the data");
          }
        });
      })
      .catch((error) => {
        toast.error("Something went wrong loading the data");
        console.log(error);
      });
  };

  const drawGrid = (grid) => {
    const ctx = canvasContextRef.current;
    const canvas = canvasRef.current;

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          const color = grid[row][col];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(
              drawingArea.x + col * gridSize,
              drawingArea.y + row * gridSize,
              gridSize,
              gridSize
            );
          }
          // grid lines
          // ctx.strokeStyle = "#ccc";
          // ctx.lineWidth = 1;
          // ctx.strokeRect(
          //   drawingArea.x + col * gridSize,
          //   drawingArea.y + row * gridSize,
          //   gridSize,
          //   gridSize
          // );
        }
      }

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 0.5;

      ctx.strokeRect(
        drawingArea.x,
        drawingArea.y,
        drawingArea.width,
        drawingArea.height
      );
    }
  };

  useEffect(() => {
    if (!isDataLoaded) {
      getCanvasDataMongoDb();
    }
  }, [isDataLoaded]);

  return (
    <GlobalContext.Provider
      value={{
        canvasRef,
        canvasContextRef,
        theme,
        initializeCanvas,
        defaultPalette,
        selectedColor,
        setSelectedColor,
        isInitialized,
        setIsInitialized,
        paletteColors,
        setPaletteColors,
        isShowCoordinates,
        setIsShowCoordinates,
        gridPixel,
        setGridPixel,
        grid,
        setGrid,
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
        isDataLoaded,
        setIsDataLoaded,
        cooldown,
        setCooldown,
        isAloowedToPlace,
        setIsAllowedToPlace,
      }}
    >
      <GlobalUpdateContext.Provider value={{}}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdateState = () => useContext(GlobalUpdateContext);
