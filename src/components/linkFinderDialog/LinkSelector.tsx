import { ChangeEvent, KeyboardEvent, MouseEvent, ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { LinkSearch, LinkSearchResult } from '../../common/LinkSearch';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Link, Widget } from '../../model/MyLinks-interface';
import { LinkIcon } from '../widgets/linkIcon/LinkIcon';
import './LinkSelector.css';

interface LinkSelectorProps {
  readonly widgets: Widget[][];
  readonly onSelected: (link: Link) => void;
}

export function LinkSelector(
  {
    widgets,
    onSelected,
  }: LinkSelectorProps
): ReactElement {
  function moveFocusToSearch(): void {
    const el = inputRef.current;
    if (el) {
      el.focus();
    }
  }

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

    moveFocusToSearch();
    setSelectedIndex(index);
  }

  function onDoubleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();

    moveFocusToSearch();

    const strIndex = e.currentTarget.dataset.index;
    const index = strIndex === undefined ? 0 : +strIndex;

    onSelected(result[index].link);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    const currIndex = selectedIndex;
    let newIndex = -1;

    if (e.key === 'ArrowUp') {
      if (currIndex > 0) {
        newIndex = currIndex - 1;
      }
    } else if (e.key === 'ArrowDown') {
      if (currIndex < (result.length - 1)) {
        newIndex = currIndex + 1;
      }
    } else if (e.key === 'Enter') {
      if (currIndex >= 0) {
        onSelected(result[currIndex].link);
      }
    } else {
      return;
    }
    if (newIndex !== -1) {
      const item = result[newIndex];
      const liElement = listRefs.get(item.id)?.current;
      if (liElement) {
        liElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      setSelectedIndex(newIndex);
    }
    e.preventDefault();
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    listRefs.clear();
    const pattern = e.target.value;
    setResult(linkSearch.filter(pattern));
    setSelectedIndex(result.length ? 0 : -1);
  }

  function widgetTitle(link: Link): string {
    const title = myLinksLookup?.findWidgetByLinkId(link.id)?.title;
    return title ? ` - ${title}` : '';
  }

  const { myLinksLookup } = useAppConfigContext();
  const listRefs = new Map<string, RefObject<HTMLLIElement>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const linkSearch = new LinkSearch();
  const [result, setResult] = useState<LinkSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const links = widgets.flat().map(w => w.list).flat();
  linkSearch.setLinks(links);

  useEffect(() => {
    moveFocusToSearch();
  }, []);

  return (
    <div className="link-selector">
      <div className="input-container">
        <i className="fas fa-search icon" />
        <input
          type="text"
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={onChange}
          placeholder="Search"
          spellCheck="false"
          className="input-box"
        />
      </div>
      <div className="list">
        <ul>
          {result.map((r, i) =>
            <li
              onClick={onClick}
              onDoubleClick={onDoubleClick}
              data-index={i}
              className={i === selectedIndex ? 'selected' : 'none'}
              ref={listRefs.get(r.id) ?? null}
              key={r.id}
            >
              <i className="list-image">
                <LinkIcon link={r.link} />
              </i>
              <div>
                {/* eslint-disable-next-line react/no-danger */}
                <span dangerouslySetInnerHTML={{ __html: r.highlighted }} />
                {widgetTitle(r.link)}
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}