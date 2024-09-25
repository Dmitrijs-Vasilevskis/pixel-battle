"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { HexColorPicker, HexColorInput } from "react-colorful";
import toast from "react-hot-toast";
import { useGlobalState } from "@/app/context/GlobalProvider";

interface Props {
  handleOpen: () => void;
}

export default function ColorPicker({ handleOpen }: Props) {
  const [customColor, setCustomColor] = useState("#000000");
  const { setPaletteColors, paletteColors, theme } = useGlobalState();

  const handleChange = (newClolor: string) => {
    setCustomColor(newClolor);
  };

  const saveColor = () => {
    const isColorExist = !!paletteColors.find(
      (color: { name: string; hex: string }) => color.hex === customColor
    );

    if (isColorExist) {
      toast.error("Color already exist");
      return;
    }

    setPaletteColors([
      ...paletteColors,
      { name: customColor, hex: customColor },
    ]);
  };

  const saveToClipboard = () => {
    navigator.clipboard.writeText(customColor);
    toast.success("Color copied to clipboard");
  };

  return (
    <ColorPickerStyle theme={theme} className="color-picker">
      <HexColorPicker
        color={customColor}
        onChange={(newColor: string) => handleChange(newColor)}
      />
      <HexColorInput
        className="color-picker-input"
        type="text"
        name="color"
        id="color"
        color={customColor}
        onChange={(newColor: string) => handleChange(newColor)}
        onClick={saveToClipboard}
      />
      <div className="color-picker-actions">
        <button className="picker-action cancel" onClick={handleOpen}>
          <span>Cancel</span>
        </button>
        <button className="picker-action save" onClick={saveColor}>
          <span>Save</span>
        </button>
      </div>
    </ColorPickerStyle>
  );
}

const ColorPickerStyle = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  left: 50%;
  padding: 20px;
  background-color: ${(props) => props.theme.colorBgOpacity};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  top: -20px;

  .color-picker-input {
    isplay: block;
    width: 100%;
    background-color: ${(props) => props.theme.colorBgOpacity};
    padding: 8px 10px;
    box-sizing: border-box;
    border-radius: 8px;
  }

  .color-picker-actions {
    display: flex;
    justify-content: space-evenly;
    gap: 1rem;
  }

  .picker-action {
    min-width: 60px;
    width: 40%;
    padding: 8px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }

  .picker-action:hover {
    transition: all 0.35s ease-in-out;
  }

  .save {
    background-color: #3e8f3e;
  }

  .cancel {
    background-color: #f44336;
  }
`;
