import React, { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';

import { COLORS, MENU_ITEMS } from '@/constants';
import { changeColor, changeBrushSize } from '@/slice/toolboxSlice';
// import { socket } from '@/socket';
import { RootState } from '@/store'; // Adjust the path as necessary

const Toolbox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state: RootState) => state.menu.activeMenuItem);
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption = activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER;
  const { color, size } = useSelector((state: RootState) => state.toolbox[activeMenuItem]);

  const updateBrushSize = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size: e.target.value }));
    // socket.emit('changeConfig', { color, size: e.target.value });
  };

  const updateColor = (newColor: string) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    // socket.emit('changeConfig', { color: newColor, size });
  };

  return (
    <div className="toolboxContainer">
      {showStrokeToolOption && (
        <div className="toolItem">
          <h4 className="toolText">Stroke Color</h4>
          <div className="itemContainer">
            <div
              className={cx('colorBox', { 'active': color === COLORS.BLACK })}
              style={{ backgroundColor: COLORS.BLACK }}
              onClick={() => updateColor(COLORS.BLACK)}
            />
            <div
              className={cx('colorBox', { 'active': color === COLORS.RED })}
              style={{ backgroundColor: COLORS.RED }}
              onClick={() => updateColor(COLORS.RED)}
            />
            <div
              className={cx('colorBox', { 'active': color === COLORS.GREEN })}
              style={{ backgroundColor: COLORS.GREEN }}
              onClick={() => updateColor(COLORS.GREEN)}
            />
            <div
              className={cx('colorBox', { 'active': color === COLORS.BLUE })}
              style={{ backgroundColor: COLORS.BLUE }}
              onClick={() => updateColor(COLORS.BLUE)}
            />
            <div
              className={cx('colorBox', { 'active': color === COLORS.ORANGE })}
              style={{ backgroundColor: COLORS.ORANGE }}
              onClick={() => updateColor(COLORS.ORANGE)}
            />
            <div
              className={cx('colorBox', { 'active': color === COLORS.YELLOW })}
              style={{ backgroundColor: COLORS.YELLOW }}
              onClick={() => updateColor(COLORS.YELLOW)}
            />
          </div>
        </div>
      )}
      {showBrushToolOption && (
        <div className="toolItem">
          <h4 className="toolText">Brush Size</h4>
          <div className="itemContainer">
            <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} value={size} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
