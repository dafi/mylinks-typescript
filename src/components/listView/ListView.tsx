import {
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useCallback, useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { ListViewHandle, ListViewItem } from './ListViewTypes';

const ClickCount = 2;

type ListViewProps = {
  readonly selectedIndex: number;
  readonly items: ListViewItem[];
  readonly onSelectionChange?: (index: number) => void;
  readonly onSelected?: (index: number) => void;
  readonly tabIndex?: number;
};

const isBetween = (value: number, lowerBound: number, upperBound: number): boolean => lowerBound <= value && value < upperBound;

export const ListView = forwardRef(function(
  { selectedIndex: startIndex, items, onSelectionChange, onSelected, tabIndex = -1 }: ListViewProps,
  ref: ForwardedRef<ListViewHandle>
): ReactElement {
  function onClick(e: MouseEvent<HTMLElement>): void {
    // skip if a dblclick is in progress
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    if (e.detail !== 1) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const strIndex = e.currentTarget.dataset.index;
    const index = strIndex === undefined ? 0 : +strIndex;

    updateSelectedIndex(index);
  }

  function onMouseDown(e: MouseEvent<HTMLElement>): void {
    // use mouseDown instead of dblClick to prevent text selection on double click
    if (e.detail !== ClickCount) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const strIndex = e.currentTarget.dataset.index;
    const index = strIndex === undefined ? 0 : +strIndex;

    updateSelectedIndex(index);

    if (onSelected) {
      onSelected(index);
    }
  }

  const listRefs = useRef(new Map<string, HTMLLIElement>());

  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const listViewRef = useRef<HTMLDivElement>(null);

  const updateSelectedIndex = useCallback((index: number): void => {
    setSelectedIndex(index);
    if (onSelectionChange) {
      onSelectionChange(index);
    }
  }, [onSelectionChange]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>): void => {
    const currIndex = selectedIndex;
    let newIndex = -1;

    switch (e.key) {
      case 'ArrowUp':
        if (currIndex > 0) {
          newIndex = currIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (currIndex < (items.length - 1)) {
          newIndex = currIndex + 1;
        }
        break;
      case 'Home':
        newIndex = items.length > 0 ? 0 : -1;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      case 'Enter':
        if (currIndex >= 0 && onSelected) {
          onSelected(currIndex);
        }
        break;
      default:
        return;
    }
    if (newIndex >= 0) {
      const item = items[newIndex];
      listRefs.current.get(item.id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      updateSelectedIndex(newIndex);
    }
    e.preventDefault();
  }, [items, listRefs, onSelected, selectedIndex, updateSelectedIndex]);

  const [prevItems, setPrevItems] = useState(items);

  if (prevItems !== items) {
    setSelectedIndex(isBetween(startIndex, 0, items.length) ? startIndex : -1);
    setPrevItems(items);
  }

  useEffect(() => {
    if (isBetween(selectedIndex, 0, items.length)) {
      const item = items[selectedIndex];
      listRefs.current.get(item.id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [selectedIndex, items]);

  useImperativeHandle(ref, (): ListViewHandle => ({
    onKeyDown(e: KeyboardEvent<HTMLElement>): void {
      onKeyDown(e);
    },
  }), [onKeyDown]);

  return (
    <div tabIndex={tabIndex} onKeyDown={onKeyDown} ref={listViewRef}>
      <ul>
        {items.map((item, index) =>
          <li
            onClick={onClick}
            onMouseDown={onMouseDown}
            data-index={index}
            className={index === selectedIndex ? 'selected' : 'none'}
            ref={el => el ? listRefs.current.set(item.id, el) : listRefs.current.delete(item.id)}
            key={item.id}
          >
            {item.element}
          </li>
        )}
      </ul>
    </div>
  );
});
