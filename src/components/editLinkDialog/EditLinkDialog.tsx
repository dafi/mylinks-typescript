import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import { EditLinkData, LinkEditedProperties } from '../../model/EditData-interface';
import Modal from '../modal/Modal';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import '../modal/StandardDialog.css';

export const editLinkDialogId = 'editLinkDialog';

export interface EditLinkDialogProps {
  readonly data: Readonly<EditLinkData>;
  readonly onSave: (editLinkData: EditLinkData) => void;
}

// https://stackoverflow.com/questions/57773734/how-to-use-partially-the-computed-property-name-on-a-type-definition/57774343#57774343
// compound properties must be strings so, we allow to index elements by string
type EditLinkDialogState = LinkEditedProperties & Record<string, string | undefined>;

export function EditLinkDialog({ data, onSave }: EditLinkDialogProps): ReactElement {
  return (
    <Modal id={editLinkDialogId}>
      <div className="standard-dialog">
        <h2 className="title">Edit Link</h2>

        <EditLinkForm data={data} onSave={onSave} />
      </div>
    </Modal>
  );
}

function EditLinkForm({ data, onSave }: EditLinkDialogProps): ReactElement {
  function onCloseDialog(code: CloseResultCode): void {
    getModal(editLinkDialogId)?.close(code);
  }

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave({ ...data, editedProperties: form });
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickCancel(): void {
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const action = e.target.dataset.action;
    if (action) {
      setForm(prevState => {
        prevState[action] = e.target.value;
        return prevState;
      });
    }
  }

  const [form, setForm] = useState<EditLinkDialogState>({
    ...data.link
  });

  return (
    <form>
      <ul className="flex-outer">
        <li>
          <label htmlFor="link-label">Label</label>
          <input
            data-action="label"
            data-auto-focus="true"
            type="text"
            defaultValue={form.label}
            onChange={onChange}
            placeholder="Videos"
          />
        </li>
        <li>
          <label htmlFor="link-url">Url</label>
          <input
            data-action="url"
            type="text"
            defaultValue={form.url}
            onChange={onChange}
            placeholder="https://youtube.com"
          />
        </li>
        <li>
          <label htmlFor="shortcut">Favicon URL</label>
          <input
            data-action="favicon"
            type="text"
            defaultValue={form.favicon}
            onChange={onChange}
            placeholder="favicon url"
          />
        </li>
        <li>
          <label htmlFor="shortcut">Shortcut</label>
          <input
            data-action="shortcut"
            type="text"
            defaultValue={form.shortcut}
            onChange={onChange}
            placeholder="press the key combination to assign"
          />
        </li>
        <li className="toolbar">
          <div className="label" />
          <div className="toolbar-left" />
          <div className="toolbar-right">
            <button
              type="button"
              className="text-white bg-action-primary hover"
              onClick={onClickSave}
            >
              Save
            </button>
            <button
              type="button"
              className="text-white bg-action-secondary hover"
              onClick={onClickCancel}
            >
              Cancel
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
