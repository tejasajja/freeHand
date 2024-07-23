import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

import { menuItemClick, actionItemClick } from '@/slice/menuSlice';
import { MENU_ITEMS } from '@/constants';
import { RootState } from '@/store'; // Adjust the path as necessary

const Menu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state: RootState) => state.menu.activeMenuItem);

  const handleMenuClick = (itemName: string) => {
    dispatch(menuItemClick(itemName));
  };

  const handleActionItemClick = (itemName: string) => {
    dispatch(actionItemClick(itemName));
  };

  return (
    <div className="menuContainer">
      <div 
        className={cx('iconWrapper', { 'active': activeMenuItem === MENU_ITEMS.PENCIL })}
        onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
      >
        <FontAwesomeIcon icon={faPencil} className="icon" />
      </div>
      <div 
        className={cx('iconWrapper', { 'active': activeMenuItem === MENU_ITEMS.ERASER })}
        onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
      >
        <FontAwesomeIcon icon={faEraser} className="icon" />
      </div>
      <div className="iconWrapper" onClick={() => handleActionItemClick(MENU_ITEMS.UNDO)}>
        <FontAwesomeIcon icon={faRotateLeft} className="icon" />
      </div>
      <div className="iconWrapper" onClick={() => handleActionItemClick(MENU_ITEMS.REDO)}>
        <FontAwesomeIcon icon={faRotateRight} className="icon" />
      </div>
      <div className="iconWrapper" onClick={() => handleActionItemClick(MENU_ITEMS.DOWNLOAD)}>
        <FontAwesomeIcon icon={faFileArrowDown} className="icon" />
      </div>
    </div>
  );
};

export default Menu;
