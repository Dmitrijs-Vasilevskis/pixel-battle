"use client";

import React, { useState } from "react";
import { useGlobalState } from "@/app/context/GlobalProvider";
import styled from "styled-components";
import ColorPicker from "../ColorPicker/ColorPicker";
import { paletteIcon, xmark } from "../../utils/icons";

interface ColorInterface {
  name: string;
  hex: string;
}

export default function Palette() {
  const {
    defaultPalette,
    selectedColor,
    setSelectedColor,
    paletteColors,
    setPaletteColors,
    isShowCoordinates,
    gridPixel,
    theme,
  } = useGlobalState();
  const [isCustomPaletteOpen, setIsCustomPaletteOpen] = useState(false);

  const handleOpen = () => {
    setIsCustomPaletteOpen(!isCustomPaletteOpen);
  };

  const handleChange = (color: ColorInterface) => {
    setSelectedColor({ name: color.name, hex: color.hex });
  };

  const deleteSelectedColor = () => {
    const isColorDefault = !!defaultPalette.find(
      (color: ColorInterface) => color.name === selectedColor.name
    );

    if (!isColorDefault) {
      setPaletteColors(
        paletteColors.filter(
          (color: ColorInterface) => color.hex !== selectedColor.hex
        )
      );

      setSelectedColor(defaultPalette[0]);
    }
  };

  return (
    <PaletteStyle theme={theme}>
      <div className="palette-wrapper">
        {isShowCoordinates && (
          <span className="pixel-position">
            x:{gridPixel[0] + 1}, y:{gridPixel[1] + 1}
          </span>
        )}
        <div className="palette-group">
          {paletteColors.map((color: ColorInterface) => (
            <input
              type="radio"
              key={color.name}
              value={color.hex}
              checked={color.hex === selectedColor.hex}
              onChange={() => handleChange(color)}
              className="palette-input-color"
              style={{ backgroundColor: color.hex }}
            ></input>
          ))}
        </div>
        <hr />
        <div className="custom-palette-wrapper">
          <div className="custom-palette">
            {isCustomPaletteOpen && <ColorPicker handleOpen={handleOpen} />}
            <div className="custom-actions">
              <button className="palette" onClick={handleOpen}>
                {paletteIcon}
              </button>
              <button className="xmark" onClick={deleteSelectedColor}>
                {xmark}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PaletteStyle>
  );
}

const PaletteStyle = styled.div`
  position: absolute;
  bottom: 20px;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;

  .pixel-position {
    position: absolute;
    top: -40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #212121;
    border-radius: 5px;
    padding: 5px 15px;
    background-color: ${(props) => props.theme.colorBgOpacity};
    pointer-events: none;
    animation: _scale-down_p4wtl_1 0.2s ease-in-out;
    transform-origin: bottom center;
  }

  .palette-wrapper {
    border: 2px solid #212121;
    border-radius: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: ${(props) => props.theme.colorBgOpacity};
    padding: 1rem;
    --size: 25px;
    pointer-events: auto;
    animation: _scale-down_p4wtl_1 0.2s ease-in-out;
    transform-origin: bottom center;

    hr {
      display: block;
      height: var(--size);
      border-radius: 1px;
      width: 2px;
      background-color: #000;
      margin: 0;
      border: none;
    }
  }

  .palette-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .palette-input-color {
    width: 20px;
    height: 20px;
    display: block;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    padding: 10px;
    transition: all 0.1s ease-in;
    animation: _appear_gk3h4_1 0.1s ease-in;
  }

  .palette-input-color:checked {
    scale: 1.2;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .custom-palette {
    position: relative;
  }

  .custom-actions {
    display: flex;
    gap: 1rem;

    button {
      width: 25px;
      height: 25px;
      outline: 2px solid #fff;
      border-radius: 50%;
      outline-offset: 2px;
      cursor: pointer;
    }
  }
`;
