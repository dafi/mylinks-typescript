import React, { ChangeEvent, ReactNode } from 'react';
import { MyLinksHolder } from '../../common/MyLinksHolder';
import { MyLinkActionCallback } from '../../model/Events';

const actions = [
  'loadConfig', 'saveConfig', 'shortcut', 'editLinks',
] as const;
export type AppToolbarActionType = (typeof actions)[number];

function isAction(action: string): action is AppToolbarActionType {
  return actions.includes(action as AppToolbarActionType);
}

interface AppToolbarProps {
  myLinksHolder: MyLinksHolder | undefined;
  action: MyLinkActionCallback<AppToolbarActionType>;
}

export class AppToolbar extends React.Component<AppToolbarProps, unknown> {
  private handleFileSelect(evt: ChangeEvent<HTMLInputElement>): void {
    if (!evt.target) {
      return;
    }
    const file = evt.target.files && evt.target.files[0];
    // onChange is not called when the path is the same so, we force the change
    evt.target.value = '';
    if (file) {
      this.props.action({ target: 'loadConfig', data: file });
    }
  }

  private onButtonClick(e: React.MouseEvent<HTMLElement>): void {
    if (e.currentTarget.dataset.action && isAction(e.currentTarget.dataset.action)) {
      this.props.action({ target: e.currentTarget.dataset.action });
    }
  }

  render(): ReactNode {
    const myLinksHolder = this.props.myLinksHolder;
    const shortcutStyle = {
      visibility: myLinksHolder?.hasShortcuts() ? 'visible' : 'collapse'
    } as React.CSSProperties;
    const saveConfigStyle = {
      visibility: myLinksHolder?.myLinks ? 'visible' : 'collapse'
    } as React.CSSProperties;
    const editStyle = {
      visibility: myLinksHolder?.myLinks.columns ? 'visible' : 'collapse'
    } as React.CSSProperties;

    return (
      <div className="toolbar-container">
        <label className="toolbar-icon" title="Load configuration from local file">
          <i className="fa fa-file-import"/>
          <input type="file" id="files" name="files[]"
                 accept="application/json"
                 onChange={(e): void => this.handleFileSelect(e)}/>
        </label>

        <label className="toolbar-icon"
               data-action="saveConfig"
               title="Save Configuration"
               style={saveConfigStyle}
               onClick={(e): void => this.onButtonClick(e)}>
          <i className="fas fa-file-download"></i>
        </label>

        <label className="toolbar-icon"
               data-action="shortcut"
               title="Toggle shortcuts visibility"
               style={shortcutStyle}
               onClick={(e): void => this.onButtonClick(e)}>
          <i className="fa fa-keyboard"/>
        </label>

        <label className="toolbar-icon"
               data-action="editLinks"
               title="Edit Links"
               style={editStyle}
               onClick={(e): void => this.onButtonClick(e)}>
          <i className="fa fa-edit"/>
        </label>
      </div>
    );
  }
}
