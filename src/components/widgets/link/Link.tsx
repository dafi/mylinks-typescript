import { MouseEvent, ReactNode } from 'react';
import { openLink } from '../../../model/MyLinks';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import { Shortcut } from '../../shortcut/Shortcut';
import { LinkIcon } from '../linkIcon/LinkIcon';
import './Link.css';
import { LinkToolbar } from './LinkToolbar';

type LinkProps = Readonly<{
  link: MLLink;
  widget: Widget;
  editable: boolean;
  draggable?: boolean;
  isMouseOver?: boolean;
}>;

export function Link(
  {
    link,
    widget,
    editable,
    draggable = true,
    isMouseOver = false,
  }: LinkProps
): ReactNode {
  function onClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    openLink(link);
  }

  return (
    <div className="ml-link-container">
      <div className="left">
        <a
          onClick={onClick}
          className="link-box"
          draggable={draggable}
        >
          <LinkIcon link={link} />
          <div className="label">{link.label}</div>
        </a>
      </div>
      <div className="right">
        <LinkToolbar visible={editable} link={link} widget={widget} />
        <Shortcut shortcut={link.hotKey} visible={!editable} isMouseOver={isMouseOver} />
      </div>
    </div>
  );
}
